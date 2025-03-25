import os
import string

non_kanji = set(
    string.digits + string.ascii_letters + string.punctuation + " 　"
    "０１２３４５６７８９"  # Full-width digits
    "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"  # Full-width uppercase
    "ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"  # Full-width lowercase
    "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞた"  # Hiragana sample
    "だちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽ"  # More Hiragana
    "まみむめもゃやゅゆょよらりるれろゎわゐゑをん"  # Remaining Hiragana
    "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタ"  # Katakana sample
    "ダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポ"  # More Katakana
    "マミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ"  # Remaining Katakana
)


def get_kanji_from_file(file_path: str, column_index: int) -> list[str]:
    kanji = []
    pwd = os.path.dirname(__file__)
    file_path = os.path.join(pwd, file_path)
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            columns = line.strip().split("\t")
            kanji_column = columns[column_index]
            kanji_column = list(kanji_column)
            kanji.extend(kanji_column)
    kanji = set(kanji)
    kanji = [kanji for kanji in kanji if kanji not in non_kanji]
    return kanji


rtk_kanji = get_kanji_from_file("rtk.txt", 4)
immersion_kanji = get_kanji_from_file("immersion.txt", 2)

rtk_only = [kanji for kanji in rtk_kanji if kanji not in immersion_kanji]
already_known = len(rtk_kanji) - len(rtk_only)
print(f"{already_known} rtk kanji already known")
print(f"{len(rtk_only)} rtk kanji missing")

rtk_missing = []
pwd = os.path.dirname(__file__)
file_path = os.path.join(pwd, "rtk.txt")
with open(file_path, "r", encoding="utf-8") as file:
    for line in file:
        columns = line.strip().split("\t")
        kanji_column = columns[4]
        lesson_column = columns[0]
        if kanji_column in rtk_only:
            rtk_missing.append((int(lesson_column), kanji_column))
rtk_missing.sort(key=lambda x: x[0])
print(rtk_missing)
