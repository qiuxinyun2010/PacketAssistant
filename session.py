
import codecs
import threading
import time
import frida
import sys


class Session:
    def __init__(self,pid):
        self.pid = pid
        self.started = False 
        self.source = None
        self.session = frida.attach(self.pid) #attache to explorer process
        with codecs.open('./hook.js', 'r', 'utf-8') as f: #inject hook.js and monitor for system calls
            self.source = f.read()


    def on_message(self,message, data):
        
        if 'payload' in message:
            payload = message['payload']
            # _,payload = message
            print('['+payload['type']+']:','[data]:',payload['data'])
        else:
            print("[on_message] message:", message, "data:", data)

    def hook(self):
        self.script.load()

    def run_hook(self):
        print("start hook")
        # self.stop_event = threading.Event()
        self.script = self.session.create_script(self.source)
        self.script.on('message', self.on_message)
        self.t = threading.Thread(target=self.hook,args=())
        self.started = True
        self.t.start()
        
    def stop_hook(self):
        print("stop_hook")
        self.started = False
        self.script.unload()



# sys.stdin.read()
# session = Session(23072)
# session.run_hook()

# time.sleep(5)
# print("stop hook")
# session.stop_hook()