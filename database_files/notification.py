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
    def __init__(self, NotificationID=None, UserID=None, Message=None, SentAt=None, IsRead=None):
        self.__NotificationID = NotificationID
        self.__UserID = UserID
        self.__Message = Message
        self.__SentAt = SentAt
        self.__IsRead = IsRead

    def get_notification_data(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)] if self.__NotificationID else ["1=1"]
        notification_data = dbconn.DBRead(tbl='Notifications', sfld='*', scond=cond)
        return notification_data

    def add_notification(self):
        dbconn = DatabaseCRUD()
        dbconn.DBCreate(
            tbl='Notifications',
            sidName='NotificationID',  # Auto-increment field, no need to pass a value
            sfld='UserID, Message, IsRead',
            svalue=f"{self.__UserID}, '{self.__Message}', {self.__IsRead}"
        )
        
    def update_notification(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)]
        sfld = f"UserID={self.__UserID}, Message='{self.__Message}', SentAt='{self.__SentAt}', IsRead={self.__IsRead}"
        dbconn.DBUpdate(tbl='Notifications', sfld=sfld, scond=cond)

    def delete_notification(self):
        dbconn = DatabaseCRUD()
        cond = ["NotificationID=" + str(self.__NotificationID)]
        dbconn.DBDelete(tbl='Notifications', scond=cond)