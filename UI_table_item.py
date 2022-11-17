from PyQt5.QtWidgets import QTableWidgetItem
from PyQt5.QtGui import QColor 
from PyQt5.QtCore import Qt
class TableItem(QTableWidgetItem):
    def __init__(self,value):
        super().__init__(value)
        self.setForeground(QColor("springgreen"))
        self.setBackground(QColor("black")) # 或用常见的颜色QColor("red")
        self.setTextAlignment(Qt.AlignHCenter |Qt.AlignVCenter)