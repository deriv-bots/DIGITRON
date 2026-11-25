import json
import websockets
from app.market_data.digit_extractor import extract_last_digit

async def stream_ticks(symbol: str, app_id: str):
    url = f"wss://ws.derivws.com/websockets/v3?app_id={app_id}"
    async with websockets.connect(url, ping_interval=20, ping_timeout=20) as ws:
        await ws.send(json.dumps({"ticks": symbol, "subscribe": 1}))
        pip_size = None
        async for raw in ws:
            msg = json.loads(raw)
            if msg.get("error"):
                raise RuntimeError(msg["error"].get("message", "Deriv API error"))
            if msg.get("msg_type") == "tick":
                tick = msg["tick"]
                pip_size = tick.get("pip_size", pip_size)
                if pip_size is None:
                    raise RuntimeError("Deriv tick did not include pip_size")
                digit = extract_last_digit(tick["quote"], pip_size)
                yield {
                    "type": "tick", "symbol": symbol, "epoch": tick.get("epoch"),
                    "quote": tick.get("quote"), "pip_size": pip_size, "digit": digit,
                    "odd_even": "Odd" if digit % 2 else "Even",
                    "over_under_5": "Over 5" if digit > 5 else ("Under 5" if digit < 5 else "Neither")
                }
