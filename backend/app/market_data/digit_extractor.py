from decimal import Decimal, InvalidOperation

def extract_last_digit(quote, pip_size):
    try:
        places = int(pip_size)
        if not 0 <= places <= 10:
            raise ValueError("Unsupported pip_size precision")
        rendered = f"{Decimal(str(quote)):.{places}f}"
        digits = [c for c in rendered if c.isdigit()]
        if not digits:
            raise ValueError("Quote contains no digits")
        return int(digits[-1])
    except (InvalidOperation, ValueError, TypeError) as exc:
        raise ValueError(f"Cannot extract last digit: {exc}") from exc
