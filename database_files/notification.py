from database_files.database import DatabaseCRUD
from abc import ABC, abstractmethod

class INotifications(ABC):
    @abstractmethod
    def get_notification_data(self):
        pass

    @abstractmethod
    def add_notification(self):
        pass

    @abstractmethod
    def update_notification(self):
        pass

    @abstractmethod
    def delete_notification(self):
        pass

class Notifications(INotifications):
    def __init__(self, NotificationID=None,notify_type=None, UserID=None, Message=None,Receiver = None, SentAt=None, IsRead=None):
        self.__NotificationID = NotificationID
        self.__UserID = UserID
        self.__Message = Message
        self.__SentAt = SentAt
        self.__IsRead = IsRead
        self.__Receiver = Receiver
        self.__notify_type = notify_type

    def get_notification_data(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)] if self.__NotificationID else ["1=1"]
        notification_data = dbconn.DBRead(tbl='Notifications', sfld='*', scond=cond)
        return notification_data

        return notification_data

    def get_user_data(self):
        dbconn = DatabaseCRUD()
        cond = ["UserID=" + str(self.__UserID)] 
        notification_data = dbconn.DBRead(tbl='Notifications', sfld='*', scond=cond , sorderBy="SentAt" , slimit="5")
        return notification_data

    def add_notification(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='Notifications',
            sidName='NotificationID',  # Auto-increment field, no need to pass a value
            sfld='UserID, Message, IsRead , Receiver ,notify_type',
            svalue=f"{self.__UserID}, '{self.__Message}', {self.__IsRead} , '{self.__Receiver}' , '{self.__notify_type}'"
        )
        
    def update_notification(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)]
        sfld = f"UserID={self.__UserID}, Message='{self.__Message}' , notify_type='{self.__notify_type}', SentAt='{self.__SentAt}', IsRead={self.__IsRead} , Receiver='{self.__Receiver}'"
        dbconn.DBUpdate(tbl='Notifications', sfld=sfld, scond=cond)

    def delete_notification(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)]
        dbconn.DBDelete(tbl='Notifications', scond=cond)