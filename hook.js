// var hndl;
// hndl = Module.findExportByName("User32.dll", "GetWindowTextW"); 
// //find  SHUnicodeToAnsi function from  ShLwApi.dll DLL
// // hooked function has this view - SHUnicodeToAnsi("password",0x11bedee4,260) , where  args[0] = password
// Interceptor.attach(hndl, {
//     onEnter: function(args) {
        // console.log("[+] Hooked GetWindowTextW");
        // var p = ptr("0x14e790");
        // console.log(args[0],args[1],args[2]);
        // console.log(p);
        // var buf = p.readByteArray(48);
        // console.log(buf);

//     }
// });

// Interceptor.attach(Module.findExportByName("User32.dll", "SetWindowTextW"), {
//     onEnter: function(args) {
//         console.log("[+] Hooked SetWindowTextW");
//         console.log(args[0]);
//         console.log(args[1]);
//         console.log(Memory.readUtf16String(args[1]));
//     }
// });
// const st = Memory.allocUtf16String("TESTMEPLZ!");
// var p = Module.findExportByName("User32.dll", "SetWindowTextW");
// console.log(p);
// const f = new NativeFunction(p, 'bool', ['pointer','pointer']);
// f(ptr(parseInt("0x5d041a",16)),st);
var buf2hex = function (buffer,split_flag='') {
	return Array.prototype.map.call(new Uint8Array(buffer), function(x){ return ('00' + x.toString(16)).slice(-2)} ).join(split_flag);
}
var buf2hex_little_end= function (buffer,split_flag='') {
	return Array.prototype.map.call(new Uint8Array(buffer), function(x){ return ('00' + x.toString(16)).slice(-2)} ).reverse().join(split_flag);
}

var buf2dec= function (buffer,split_flag='') {
	return Array.prototype.map.call(new Uint8Array(buffer), function(x){ return (x.toString(10))} ).join(split_flag);
}
Interceptor.attach(Module.findExportByName("ws2_32.dll", "send"), {
    onEnter: function(args) {
        console.log("[+] Hooked send");
        var fd = args[0];
        var buf = ptr(args[1]);
        var len = args[2].toInt32();
        var flag = args[3];
        console.log(fd,buf,len,flag);
        // var data = buf.readByteArray(len);
        var data = Memory.readByteArray(buf, len);
        // console.log("data:",data);
        // console.log("data:",hexdump(data, { offset: 0, length: len, header: false, ansi: true }));
        console.log("hex:",buf2hex(data));
    }
});
Interceptor.attach(Module.findExportByName("ws2_32.dll", "WSASend"), {
    onEnter: function(args) {
        console.log("[+] Hooked WSASend");
        var fd = args[0];
        var lpBuffers = ptr(args[1]);
        var dwBufferCount = args[2].toInt32();
        console.log(fd,lpBuffers,dwBufferCount);

        // console.log("lpBuffers.readUInt()",lpBuffers.readUInt());
        // var len_hex = buf2hex_little_end(Memory.readByteArray(lpBuffers, 4));
        // console.log("len_hex:",len_hex);
        // var len = parseInt(len_hex,16);

        var len = lpBuffers.readUInt();
        // console.log("len",len);
        
        // var buf = Memory.readByteArray(ptr(lpBuffers.add(4)), 4);
        // var buf_ptr = buf2hex_little_end(buf,'');
        // buf_ptr = ptr('0x'+buf_ptr);

        var buf_ptr = ptr(ptr(lpBuffers.add(4)).readUInt());
        // console.log(buf_ptr,buf_ptr2);

        var data = Memory.readByteArray(buf_ptr, len);
        // console.log("data:",buf2hex(data));
        // send("wsa_send",data=data);
        var from = getSocktName(args[0].toInt32());
        var to = getPeerName(args[0].toInt32());
        // console.log("len",len,len.toString());
        send({
            fd:args[0].toString(10),
            type:"发送",
            func:"wsa_send",
            from:from,
            to:to,
            len:len.toString(),
            data:buf2hex(data,' ')
        });
    }
});
const getsockname = Module.findExportByName("ws2_32.dll", "getsockname");
const getpeername = Module.findExportByName("ws2_32.dll", "getpeername");
// console.log(getsockname);
const getsocknamePtr = new NativeFunction(getsockname, 'int', ['int','pointer','pointer']);
const getpeernamePtr = new NativeFunction(getpeername, 'int', ['int','pointer','pointer']);

var getPeerName = function(fd) {
    var sockaddr = Memory.alloc(16);
    var len = Memory.alloc(4);
    len.writeInt(16);
    getpeernamePtr(fd,sockaddr,len);
    // var buf = sockaddr.readByteArray(16);
    // console.log("buf:",buf);
    // var family = sockaddr.readShort();
    var port = parseInt(buf2hex((sockaddr.add(2)).readByteArray(2)),16);
    var address = buf2dec((sockaddr.add(4)).readByteArray(4),'.');
    // console.log("res:",family,port,port2,address);
    return address+":"+port;
};
var getSocktName = function(fd){
    var sockaddr = Memory.alloc(16);
    var len = Memory.alloc(4);
    len.writeInt(16);
    getsocknamePtr(fd,sockaddr,len);
    // var buf = sockaddr.readByteArray(16);
    // console.log("buf:",buf);
    // var family = sockaddr.readShort();
    var port = parseInt(buf2hex((sockaddr.add(2)).readByteArray(2)),16);
    var address = buf2dec((sockaddr.add(4)).readByteArray(4),'.');
    // console.log("res:",family,port,port2,address);
    return address+":"+port;
};
