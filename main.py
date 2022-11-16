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

from PyQt5.QtWidgets import (QWidget, QPushButton, QLineEdit, QMessageBox,QMainWindow,
    QInputDialog, QApplication)
# from task import Session
from session import Session
from Ui_attach import Ui_AttachWindow
from Ui_session import Ui_MainWindow
import sys

class Main_Window(QMainWindow):

    def __init__(self):
        super().__init__()
        self.ui = Ui_AttachWindow()
        self.ui.setupUi(self)
        self.ui.pushButton.clicked.connect(self.handleAttach)

        self.session = None
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
    def handleStart(self):
        if self.session is None:
            return 
        if self.session.started:
            self.session.stop_hook()
            self.startBtn.setText("开始")
        else: 
            self.session.run_hook()
            self.startBtn.setText("停止")
            # self.startbtn.setCheckable(False)
if __name__ == '__main__':

    app = QApplication(sys.argv)
    ex = Main_Window()
    
    ex.show()
    sys.exit(app.exec_())