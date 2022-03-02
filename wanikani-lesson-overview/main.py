import requests

TOKEN = "271243b2-17ba-4241-bcad-23a711ce1760"


def wanikani_client(url: str, ids: str = None) -> str:
    headers = {
        "Wanikani-Revision": "20170710",
        "Authorization": "Bearer {token}".format(token=TOKEN)
    }

    query_params = {
        "levels": ids
    }

    return requests.get(url, headers=headers, params=query_params).json()["data"]


def separate_lesson_types(lessons: list) -> dict:
    radical = []
    kanji = []
    vocabulary = []

    for lesson in lessons:
        lesson_type = lesson["object"]
        if lesson_type == "radical":
            radical.append(lesson)
        if lesson_type == "kanji":
            kanji.append(lesson)
        if lesson_type == "vocabulary":
            vocabulary.append(lesson)

    lesson_dict = {
        "radical": radical,
        "kanji": kanji,
        "vocabulary": vocabulary
    }

    return lesson_dict


if __name__ == '__main__':
    user_level = wanikani_client("https://api.wanikani.com/v2/user")["level"]
    data = wanikani_client("https://api.wanikani.com/v2/summary")
    lessons = data["lessons"][0]["subject_ids"]
    current_data = wanikani_client("https://api.wanikani.com/v2/subjects", user_level)
    previous_data = wanikani_client("https://api.wanikani.com/v2/subjects", user_level - 1)

    level_data = current_data + previous_data

    previous_level = []
    current_level = []

    for lesson in lessons:
        for level in level_data:
            if int(lesson) == level["id"]:
                if level["data"]["level"] == user_level:
                    current_level.append(level)
                else:
                    previous_level.append(level)

    previous_level_dict = separate_lesson_types(previous_level)
    current_level_dict = separate_lesson_types(current_level)

    print("Total Lessons: {total_lessons}".format(total_lessons=len(lessons)))
    print("Lessons from level {level} - Radical: {radical}, Kanji: {kanji}, Vocabulary: {vocabulary}"
          .format(level=user_level - 1, radical=len(previous_level_dict["radical"]), kanji=len(previous_level_dict["kanji"])
                  , vocabulary=len(previous_level_dict["vocabulary"])))

    print("Lessons from level {level} - Radical: {radical}, Kanji: {kanji}, Vocabulary: {vocabulary}"
          .format(level=user_level, radical=len(current_level_dict["radical"]), kanji=len(current_level_dict["kanji"])
                  , vocabulary=len(current_level_dict["vocabulary"])))

