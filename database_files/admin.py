from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class IAdmins(ABC):
    @abstractmethod
    def get_admin_data(self):
        pass

    @abstractmethod
    def add_admin(self):
        pass

    @abstractmethod
    def update_admin(self):
        pass

    @abstractmethod
    def delete_admin(self):
        pass

class Admins(IAdmins):
    def __init__(self, AdminID=None, Role=None):
        self.__AdminID = AdminID
        self.__Role = Role

    def get_admin_data(self):
        dbconn = DatabaseCRUD()
        cond = ["AdminID=" + str(self.__AdminID)] if self.__AdminID else ["1=1"]
        admin_data = dbconn.DBRead(tbl='Admins', sfld='*', scond=cond)
        return admin_data

    def add_admin(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(tbl='Admins', sidName='AdminID', sfld='Role',
                        svalue=f"'{self.__Role}'")

    def update_admin(self):
        dbconn = DatabaseCRUD()
        cond = ["AdminID=" + str(self.__AdminID)]
        sfld = f"Role='{self.__Role}'"
        dbconn.DBUpdate(tbl='Admins', sfld=sfld, scond=cond)

    def delete_admin(self):
        dbconn = DatabaseCRUD()
        cond = ["AdminID=" + str(self.__AdminID)]
        dbconn.DBDelete(tbl='Admins', scond=cond)
        
        
      