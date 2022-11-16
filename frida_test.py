
import codecs
import threading
import time
import frida
import sys

def on_message(message, data):
    print("[on_message] message:", message, "data:", data)

session = frida.attach(23072) #attache to explorer process
with codecs.open('./hook.js', 'r', 'utf-8') as f: #inject hook.js and monitor for system calls
    source = f.read()
script = session.create_script(source)
script.on('message', on_message)
stop_ev = [False]
def run(script):
    script.load()
    while not stop_ev[0]:
        time.sleep(1)
        print("hooking")
# sys.stdin.read()
t = threading.Thread(target=run,args=(script,))
t.start()
time.sleep(5)
print("stop hook")
stop_ev[0] = True 
