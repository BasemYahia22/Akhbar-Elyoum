from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IUsers(ABC):
    @abstractmethod
    def get_user_data(self):
        pass

    @abstractmethod
    def add_user(self):
        pass

    @abstractmethod
    def update_user(self):
        pass

    @abstractmethod
    def delete_user(self):
        pass

class Users(IUsers):
    def __init__(self, UserID=None, FirstName=None, LastName=None, Email=None, PasswordHash=None, UserType=None, gender = None , status=0):
        self.__UserID = UserID
        self.__FirstName = FirstName
        self.__LastName = LastName
        self.__Email = Email
        self.__PasswordHash = PasswordHash
        self.__UserType = UserType
        self.__gender = gender
        self.__status= status

    def get_user_data(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)] if self.__UserID else ["1=1"]
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data

    def add_user(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Users', sidName='UserID', sfld='FirstName, LastName, Email, PasswordHash, UserType , gender , status',
                        svalue=f"'{self.__FirstName}', '{self.__LastName}', '{self.__Email}', '{self.__PasswordHash}', '{self.__UserType}' , '{self.__gender}', '{self.__status}'")

    def update_user(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)]
        sfld = f"FirstName='{self.__FirstName}', LastName='{self.__LastName}', Email='{self.__Email}', PasswordHash='{self.__PasswordHash}', UserType='{self.__UserType}',gender='{self.__gender}',status='{self.__status}'"
        dbconn.DBUpdate(tbl='Users', sfld=sfld, scond=cond)

    def set_data(self):
        std=[]
        std = self.get_user_data()
        self.__UserID= std[0]['UserID']
        self.__FirstName = std[0]['FirstName']
        self.__LastName = std[0]['LastName']
        self.__Email = std[0]['Email']
        self.__PasswordHash = std[0]['PasswordHash']
        self.__UserType = std[0]['UserType']
        self.__gender = std[0]['gender']
        self.__status= std[0]['status']
        return std



    def delete_user(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)]
        dbconn.DBDelete(tbl='Users', scond=cond)
        
           
    def login(self):
        # Check if the email exists in the database
        std_data = self.get_user_data()
        if len(std_data):
            # Check if the password matches
            if std_data[0]['status'] == 1: 
                return False, "User account is disabled."
            if std_data[0]['PasswordHash'] == super().getPass() :
                return True, std_data[0]['UserID'], "Login successful."
            else:
                return False, 0,"Incorrect password."
        else:
            return False, 0, "Email not found. Please sign up or check your email."
   
        