#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
ZetCode PyQt5 tutorial 

In this example, we receive data from
a QInputDialog dialog. 

Aauthor: Jan Bodnar
Website: zetcode.com 
Last edited: August 2017
"""

import sys
from PyQt5.QtWidgets import (QWidget, QPushButton, QLineEdit, QMessageBox,QMainWindow,QTableWidgetItem,
    QInputDialog, QApplication,QHBoxLayout,QVBoxLayout,QLabel,QListWidgetItem)
from PyQt5.QtCore import pyqtSignal
from PyQt5.QtCore import QSize
# from task import Session
from session import Session
from Ui_attach import Ui_AttachWindow
from Ui_session import Ui_MainWindow
from UI_table_item import TableItem
class Main_Window(QMainWindow):
    listaddItemSignal = pyqtSignal(dict)
    def __init__(self):
        super().__init__()
        self.ui = Ui_AttachWindow()
        self.ui.setupUi(self)
        self.ui.pushButton.clicked.connect(self.handleAttach)
        self.session = None
        self.listaddItemSignal.connect(self.handleListAddItem)
        

    def handleAttach(self):

        # session.show()
        # if self.session is not None:
        #     print("disattach pid",self.session.pid)
        #     self.btn.setText("注入")
        #     self.session = None
        # else:
        
        if not self.ui.lineEdit.text().isdigit():
            QMessageBox.critical(self,"错误","pid需要是整数！")
            return 
        pid = int(self.ui.lineEdit.text())
        print("attach pid",pid)
        try:
            self.session = Session(pid)
        except:
            QMessageBox.critical(self,"错误","无法找到进程PID！")
            return
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.setWindowTitle( "进程PID: ["+str(pid)+"]")
        self.startBtn = self.ui.startBtn
        self.startBtn.clicked.connect(self.handleStart)
        self.ui.tableWidget.cellClicked[int,int].connect(self.tableItemClicked)#连接单元格点击信号和槽
        # self.ui.tableWidget.itemClicked.connect(self.tableItemClicked)
    def handleStart(self):
        if self.session is None:
            return 
        if self.session.started:
            self.session.stop_hook()
            self.startBtn.setText("开始")
        else: 
            self.session.run_hook(self.on_message)
            self.startBtn.setText("停止")
            # self.startbtn.setCheckable(False)
    def handleListAddItem(self,payload):
            print("handleListAddItem",payload)
            cnt = self.ui.tableWidget.rowCount()
            self.ui.tableWidget.insertRow(cnt)
            self.ui.tableWidget.setItem(cnt,0,TableItem(payload['type']))
            self.ui.tableWidget.setItem(cnt,1,TableItem(payload['func']))
            self.ui.tableWidget.setItem(cnt,2,TableItem(payload['fd']))
            self.ui.tableWidget.setItem(cnt,3,TableItem(payload['from']))
            self.ui.tableWidget.setItem(cnt,4,TableItem(payload['to']))
            self.ui.tableWidget.setItem(cnt,5,TableItem(payload['len']))
            dataItem = TableItem(payload['data'])
            self.ui.tableWidget.setItem
            self.ui.tableWidget.setItem(cnt,6,dataItem)

            # item = QListWidgetItem() # 创建QListWidgetItem对象

            # item.setSizeHint(QSize(100, 50)) # 设置QListWidgetItem大小
            # w = QWidget()
            # layout_main = QHBoxLayout()
            # # item_data.setMaximumWidth(100)
            # layout_main.addWidget(QLabel('2') )
            # layout_main.addWidget(QLabel(payload['type']) )
            # layout_main.addWidget(QLabel(payload['data']))
            # w.setLayout(layout_main) # 布局给wight
            # self.ui.tableWidget.addItem(item) # 添加item
            # self.ui.tableWidget.setItemWidget(item, w) # 为item设置widget
    def tableItemClicked(self,x,y):
        item = self.ui.tableWidget.currentItem()
        # print("item:",item,x,y)
        if y==6:
            self.ui.textBrowser.setText(item.text())
    def on_message(self,message, data):
        
        if 'payload' in message:
            payload = message['payload']
            # _,payload = message
            print('['+payload['type']+']:','[data]:',payload['data'])
            # self.ui.listWidget.add(get_item_wight(payload))
            self.listaddItemSignal.emit(payload)

        else:
            print("[on_message] message:", message, "data:", data)

if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = Main_Window()
    
    ex.show()
    sys.exit(app.exec_())