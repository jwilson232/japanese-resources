from datetime import date, timedelta

total_cards = 0
from_anki = 1133
per_day = 10
per_day_new_year = 5
stop_mining = date(2025, 7, 1)
new_year = date(2024, 12, 31)

until_new_year = new_year - date.today()
until_new_year = until_new_year.days
total_cards = until_new_year * per_day

until_stop = stop_mining - new_year + timedelta(1)
total_cards = total_cards + (until_stop.days * (per_day + per_day_new_year))

print(f"Total Cards: {total_cards + from_anki}")
print(f"Skip Days: {(total_cards + from_anki - 5000) / 10}")
