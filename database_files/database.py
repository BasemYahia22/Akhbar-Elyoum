import sqlalchemy
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, ForeignKey, DateTime, Row
import os
from abc import ABC, abstractmethod


class DatabaseConn():
    def __init__(self, hostName='sql.freedb.tech', dbName='freedb_akhbarelyoum', usrName='freedb_aposaad3435', password='MMsX*$VVQjr7Qdp'):
        self.__hostName = hostName
        self.__dbName = dbName
        self.__usrName = usrName
        self.__password=password
    def connectDb(self):
        engine = create_engine(
            'mysql+pymysql://' + self.__usrName + ':' + self.__password + '@' + self.__hostName + '/' + self.__dbName + '?charset=utf8mb4'
        )
        return engine

class IDatabaseCRUD(ABC): 
    @abstractmethod
    def DBRead(self,tbl,sfld='*',scond=["1=1"],sorderBy='',sorderType='desc',slimit='',sgrpby=''):
        pass

    @abstractmethod
    def DBCreate(self,tbl,sfld='',svalue=["1=1"],sidName='id'):
        pass

    @abstractmethod
    def DBUpdate(self,tbl,sfld='',scond=["1=1"]):
        pass

    @abstractmethod
    def DBDelete(self,tbl,scond=["1=1"]):
        pass  
    
class DatabaseCRUD(DatabaseConn):
    def __init__(self, hostName='sql.freedb.tech', dbName='freedb_akhbarelyoum', usrName='freedb_aposaad3435', password='MMsX*$VVQjr7Qdp'):
        super().__init__(hostName=hostName,dbName=dbName,usrName=usrName,password=password)

    def DBRead(self,tbl,sfld='*',scond=["1=1"],sorderBy='',sorderType='desc',slimit='',sgrpby=''):

        Sqlst = "select " + sfld + " from " + tbl 
        if scond != '':
            Sqlst += ' where '
            sCondCont = len(scond)
            contX=1
            for cnd in scond:
                if contX==sCondCont:
                    Sqlst += cnd 
                else:
                    Sqlst += cnd + " and "
                contX = contX + 1
        if sgrpby != '':
            Sqlst += " group by " + sgrpby
        if sorderBy != '':
            Sqlst += " order by " + sorderBy + " " + sorderType
        if slimit != '':
            Sqlst += " limit " + slimit
        # print(Sqlst)
        engineX= self.connectDb()
        with engineX.connect() as conn:
            result = conn.execute(text(Sqlst))
            sData = []
            for row in result.all():
                sData.append(row._asdict())
        return sData

    
    def DBCreate(self,tbl,sfld='',svalue=["1=1"],sidName='id'):
        cust=self.DBRead(tbl=tbl,sfld="ifnull(max(" + sidName + "),0)+1 as maxid")
        newId=str(cust[0]['maxid'])
        print('newId='+newId)
        Sqlst = "insert into " + tbl + "(" + sidName + "," + sfld + ") values(" + newId + "," + svalue + ")"
        engineX= self.connectDb()
        with engineX.connect() as conn:
            conn.execute(text(Sqlst))
            conn.commit()
    
    def DBUpdate(self,tbl,sfld='',scond=["1=1"]):
        Sqlst = "update " + tbl + " set " + sfld 
        if scond != '':
            Sqlst += ' where '
            sCondCont = len(scond)
            contX=1
            for cnd in scond:
                if contX==sCondCont:
                    Sqlst += cnd 
                else:
                    Sqlst += cnd + " and "
                contX = contX + 1
            engineX= self.connectDb()
            with engineX.connect() as conn:
                conn.execute(text(Sqlst))
                conn.commit()

    def DBDelete(self,tbl,scond=["1=1"]):
        Sqlst = "delete from " + tbl 
        if scond != '':
            Sqlst += ' where '
            sCondCont = len(scond)
            contX=1
            for cnd in scond:
                if contX==sCondCont:
                    Sqlst += cnd 
                else:
                    Sqlst += cnd + " and "
                contX = contX + 1
            engineX= self.connectDb()
            with engineX.connect() as conn:
                conn.execute(text(Sqlst))
                conn.commit()

    def execute_query_v2(self, query):
        """
        Placeholder for actual database execution logic.
        Replace this method with your database driver's query execution code.
        """
        # Example: Use a database cursor to execute the query
        return []  # Replace with actual results from the database

