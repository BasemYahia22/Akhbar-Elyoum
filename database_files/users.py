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
    def __init__(self, UserID=None, FirstName=None, LastName=None, Email=None, PasswordHash=None, UserType=None, gender = None , status=0 , std_code="10"):
        self.__UserID = UserID
        self.__FirstName = FirstName
        self.__LastName = LastName
        self.__Email = Email
        self.__PasswordHash = PasswordHash
        self.__UserType = UserType
        self.__gender = gender
        self.__status= status
        self.__std_code = std_code

    def getPass(self) : 
        return self.__PasswordHash
    

    def getName(self) : 
        return self.__FirstName
    
    
    def get_user_data(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)] if self.__UserID else ["1=1"]
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    
    def get_user_data_by_email(self):
        dbconn = DatabaseCRUD()
        cond = [f"Email='{self.__Email}'"] 
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    
    def get_user_data_by_userttype(self):
        dbconn = DatabaseCRUD()
        cond = [f"UserType='{self.__UserType}'"]
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    
    
    def get_user_data_student(self):
        dbconn = DatabaseCRUD()
        cond = [f"UserID={self.__UserID} and UserType='{self.__UserType}'"] 
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    def get_user_data_admin(self):
        dbconn = DatabaseCRUD()
        cond = [f"UserID={self.__UserID} and UserType='{self.__UserType}'"] 
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    def get_pro_data(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)] if self.__UserID else ["1=1"]
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=cond)
        return user_data
    
    def get_user_data_with_email_password(self , email , password ):
        dbconn = DatabaseCRUD()
        
        # Properly format the condition with quotes and logical operator
        cond = f"Email='{email}' AND PasswordHash='{password}' "
        
        # Fetch user data from the database
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=[cond])
        
        return user_data
    
    def get_user_data_with_email(self , email):
        dbconn = DatabaseCRUD()
        
        # Properly format the condition with quotes and logical operator
        cond = f"Email='{email}'"
        
        # Fetch user data from the database
        user_data = dbconn.DBRead(tbl='Users', sfld='*', scond=[cond])
        
        return user_data

    def add_user(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Users', sidName='UserID', sfld='FirstName, LastName, Email, PasswordHash, UserType , gender , status,std_code',
                        svalue=f"'{self.__FirstName}', '{self.__LastName}', '{self.__Email}', '{self.__PasswordHash}', '{self.__UserType}' , '{self.__gender}', '{self.__status}' , '{self.__std_code}'")

    def update_user(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)]
        sfld = f"FirstName='{self.__FirstName}', LastName='{self.__LastName}', Email='{self.__Email}', PasswordHash='{self.__PasswordHash}', UserType='{self.__UserType}',gender='{self.__gender}',status='{self.__status}' ,std_code='{self.__std_code}'"
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
        self.__std_code= std[0]['std_code']
        return std

    def total_number_of_students(self) : 
        dbconns = DatabaseCRUD()
        cond =[f"UserType='Student' or UserType='student'"]
        data = dbconns.DBRead(tbl="Users" , sfld="Count(Distinct UserID)" , scond=cond)
        return data

    def total_number_of_professors(self) : 
        dbconns = DatabaseCRUD()
        cond =[f"UserType='Professor' or UserType='professor'"]
        data = dbconns.DBRead(tbl="Users" , sfld="Count(Distinct UserID) as number_of_professor" , scond=cond)
        return data
        

    def delete_user(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)]
        dbconn.DBDelete(tbl='Users', scond=cond)
        
           
    # def login(self, email , password , usertype):
    #     # Check if the email exists in the database
    #     std_data = self.get_user_data_with_email_password(email, password)
    #     print(f"std_data : {std_data}" )
    #     if len(std_data):
    #         # Check if the password matches
    #         if std_data[0]['status'] == 1: 
    #             return False, "User account is disabled."
    #         if std_data[0]['Email'] == email :
    #             if std_data[0]['PasswordHash'] == password :
    #                 if (std_data[0]['UserType']).lower() == usertype.lower() :
    #                     return True, std_data[0]['UserID'], "Login successful."
    #                 else : 
    #                     return False, 0,"Incorrect user type."
    #             else : 
    #                 return False, std_data[0]['UserID'], "Invalid password"
    #         else:
    #             return False, 0,"Incorrect password."
    #     else:
    #         return False, 0, "Email not found or Password is Wrong. Please sign up or check your email."
   
    def login(self, email, password, usertype):
        # Check if the email exists in the database
        std_data = self.get_user_data_with_email_password(email, password)
        print(f"std_data : {std_data}")
        if len(std_data):
            # Check if account is disabled
            if std_data[0]['status'] == 1: 
                return False, 0, "User account is disabled."  # Now returns 3 values
            
            # Check credentials
            if std_data[0]['Email'] == email:
                if std_data[0]['PasswordHash'] == password:
                    if (std_data[0]['UserType']).lower() == usertype.lower():
                        return True, std_data[0]['UserID'], "Login successful."
                    else:
                        return False, 0, "Incorrect user type."
                else:
                    return False, std_data[0]['UserID'], "Invalid password"
            else:
                return False, 0, "Incorrect password."
        else:
            return False, 0, "Email not found or Password is Wrong. Please sign up or check your email."    