from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IGradeReviews(ABC):
    @abstractmethod
    def get_grade_review_data(self):
        pass

    @abstractmethod
    def add_grade_review(self):
        pass

    @abstractmethod
    def update_grade_review(self):
        pass

    @abstractmethod
    def delete_grade_review(self):
        pass

class GradeReviews(IGradeReviews):
    def __init__(self, ReviewID=None, StudentID=None, CourseID=None, RequestDate=None, Status=None):
        self.__ReviewID = ReviewID
        self.__StudentID = StudentID
        self.__CourseID = CourseID
        self.__RequestDate = RequestDate
        self.__Status = Status

    def get_grade_review_data(self):
        dbconn = DatabaseCRUD()
        cond = ["ReviewID=" + str(self.__ReviewID)] if self.__ReviewID else ["1=1"]
        grade_review_data = dbconn.DBRead(tbl='GradeReviews', sfld='*', scond=cond)
        return grade_review_data

    def add_grade_review(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='GradeReviews', sidName='ReviewID', sfld='StudentID, CourseID, RequestDate, Status',
                        svalue=f"{self.__StudentID}, {self.__CourseID}, '{self.__RequestDate}', '{self.__Status}'")

    def update_grade_review(self):
        dbconn = DatabaseCRUD()
        cond = ["ReviewID=" + str(self.__ReviewID)]
        sfld = f"StudentID={self.__StudentID}, CourseID={self.__CourseID}, RequestDate='{self.__RequestDate}', Status='{self.__Status}'"
        dbconn.DBUpdate(tbl='GradeReviews', sfld=sfld, scond=cond)

    def delete_grade_review(self):
        dbconn = DatabaseCRUD()
        cond = ["ReviewID=" + str(self.__ReviewID)]
        dbconn.DBDelete(tbl='GradeReviews', scond=cond)