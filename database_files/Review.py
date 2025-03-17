from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IReview(ABC):
    @abstractmethod
    def get_review_data(self):
        pass

    @abstractmethod
    def add_review(self):
        pass

    @abstractmethod
    def update_review(self):
        pass

    @abstractmethod
    def delete_review(self):
        pass

class Review(IReview):
    def __init__(self, id=None, studentID=None,course_code =None ,  review_title=None,review_type=None ,  email_prof=None, review_text=None):
        self.__id = id
        self.__studentID = studentID
        self.__review_title = review_title
        self.__email_prof = email_prof
        self.__review_text = review_text
        self.__review_type = review_type
        self.__course_code = course_code 

    def get_review_data(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)] if self.__id else ["1=1"]
        review_data = dbconn.DBRead(tbl='review', sfld='*', scond=cond)
        return review_data

    def add_review(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='review',
            sidName='id',  # Auto-increment field, no need to pass a value
            sfld='studentID, review_title, email_prof, review_text , review_type ,course_code ',
            svalue=f"{self.__studentID}, '{self.__review_title}', '{self.__email_prof}', '{self.__review_text}' , '{self.__review_type}' , '{self.__course_code }'"
        )

    def update_review(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        sfld = f"studentID={self.__studentID}, review_title='{self.__review_title}', email_prof='{self.__email_prof}', review_text='{self.__review_text}' , review_type='{self.__review_type}' , course_code='{self.__course_code}'"
        dbconn.DBUpdate(tbl='review', sfld=sfld, scond=cond)

    def delete_review(self):
        dbconn = DatabaseCRUD()
        cond = ["id=" + str(self.__id)]
        dbconn.DBDelete(tbl='review', scond=cond)