from .settings import FILE_FORMATS


def get_file_type(file_name: str) -> str:
    try:
        file_extension = file_name.split('.')[-1]
        for file_type in FILE_FORMATS:
            if file_extension in FILE_FORMATS.get(file_type):
                return file_type
        return "unsupported"
    except IndexError:
        return "unsupported"
