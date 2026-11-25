from app.market_data.digit_extractor import extract_last_digit

def test_decimal_precision():
    assert extract_last_digit("123.456", 3) == 6

def test_trailing_zero():
    assert extract_last_digit("123.4", 2) == 0

def test_integer_quote():
    assert extract_last_digit("123", 0) == 3
