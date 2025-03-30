from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IStudents(ABC):
    @abstractmethod
    def get_student_data(self):
        pass

    @abstractmethod
    def add_student(self):
        pass

    @abstractmethod
    def update_student(self):
        pass

    @abstractmethod
    def delete_student(self):
        pass

class Students(IStudents):
    def __init__(self, StudentID=None, Major=None , StudentID_fk = None , department = None ,  semester_number = None ,  squad_number= None , AcademicLevel=None, std_code = None):
        self.__StudentID = StudentID
        self.__Major = Major
        self.__AcademicLevel = AcademicLevel
        self.__std_code = std_code
        self.__squad_number = squad_number
        self.__semester_number = semester_number
        self.__department = department
        self.__StudentID_fk = StudentID_fk

    def get_student_data(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)] if self.__StudentID else ["1=1"]
        student_data = dbconn.DBRead(tbl='Students', sfld='*', scond=cond)
        return student_data

    def get_student_data_with_StudentID_fk(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID_fk=" + str(self.__StudentID_fk)] 
        student_data = dbconn.DBRead(tbl='Students', sfld='*', scond=cond)
        return student_data
    
    def get_student_data_squad_number(self):
        dbconn = DatabaseCRUD()
        
        # Ensure proper formatting of conditions
        cond = f"StudentID = {self.__StudentID} and squad_number={self.__squad_number} AND semester_numer={self.__semester_number}"
        
        # Fetch data from the database
        student_data = dbconn.DBRead(tbl='Students', sfld='*', scond=[cond])

        return student_data

    def add_student(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Students', sidName='StudentID', sfld='Major, AcademicLevel,  std_code , squad_number , semester_numer , department , StudentID_fk',
                        svalue=f"'{self.__Major}', '{self.__AcademicLevel}', '{self.__std_code}' ,{self.__squad_number} ,{self.__semester_number}, '{self.__department}' , {self.__StudentID_fk}")

    def update_student(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)]
        sfld = f"Major='{self.__Major}', AcademicLevel='{self.__AcademicLevel}', std_code='{self.__std_code}', squad_number={self.__squad_number} , semester_numer={self.__semester_number} , StudentID_fk = {self.__StudentID_fk} , department='{self.__department}'"
        dbconn.DBUpdate(tbl='Students', sfld=sfld, scond=cond)

    def delete_student(self):
        dbconn = DatabaseCRUD()
        cond = ["StudentID=" + str(self.__StudentID)]
        dbconn.DBDelete(tbl='Students', scond=cond)
        
        
    def get_max_semester_info(self):
        dbconn = DatabaseCRUD()
        
        # Step 1: Get the max semester ID for the student
        cond = [f"StudentID={self.__StudentID}"]
        max_semester_id_data = dbconn.DBRead(tbl='Students', sfld='MAX(semester_numer) AS MaxSemesterID', scond=cond)
        
        if not max_semester_id_data or not max_semester_id_data[0]['MaxSemesterID']:
            return None

        max_semester_id = max_semester_id_data[0]['MaxSemesterID']
        
        return {
            "MaxSemesterID": max_semester_id
        }

    def get_data_by_squad_semester_std(self):
        if not self.__StudentID or not self.__semester_number:
            raise ValueError("Student ID and Semester ID are required")

        dbconn = DatabaseCRUD()
        cond = [f"StudentID={self.__StudentID} AND semester_numer={self.__semester_number} AND squad_number={self.__squad_number}"]
        grade_data = dbconn.DBRead(tbl='Students', sfld='*', scond=cond)

        if not grade_data:
            return {"error": "Student ID does not exist or no grade data found!"}

        return grade_data

        
        
    def get_current_squad_and_semester(self):
        dbconn = DatabaseCRUD()

        if not self.__StudentID:
            raise ValueError("Student ID is required")

        # Step 1: Get the maximum semester number for the student
        cond = [f"StudentID={self.__StudentID}"]
        max_semester_data = dbconn.DBRead(
            tbl='Students', 
            sfld='MAX(semester_numer) AS MaxSemester', 
            scond=cond
        )

        if not max_semester_data or not max_semester_data[0]['MaxSemester']:
            return None

        max_semester = max_semester_data[0]['MaxSemester']

        # Step 2: Get the maximum squad number within the max semester
        cond = [
            f"StudentID={self.__StudentID}",
            f"semester_numer={max_semester}"
        ]
        max_squad_data = dbconn.DBRead(
            tbl='Students', 
            sfld='MAX(squad_number) AS MaxSquad', 
            scond=cond
        )

        if not max_squad_data or not max_squad_data[0]['MaxSquad']:
            return None

        max_squad = max_squad_data[0]['MaxSquad']

        # Step 3: Retrieve the full records based on the max semester and squad
        cond = [
            f"StudentID={self.__StudentID}",
            f"semester_numer={max_semester}",
            f"squad_number={max_squad}"
        ]
        full_data = dbconn.DBRead(tbl='Students', sfld='*', scond=cond)


        return full_data
