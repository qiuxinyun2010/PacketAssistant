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
var buf2hex = function (buffer) {
	return Array.prototype.map.call(new Uint8Array(buffer), function(x){ return ('00' + x.toString(16)).slice(-2)} ).join(' ');
}
var buf2hex_little_end= function (buffer,split_flag='') {
	return Array.prototype.map.call(new Uint8Array(buffer), function(x){ return ('00' + x.toString(16)).slice(-2)} ).reverse().join(split_flag);
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
        console.log("len",len);
        
        // var buf = Memory.readByteArray(ptr(lpBuffers.add(4)), 4);
        // var buf_ptr = buf2hex_little_end(buf,'');
        // buf_ptr = ptr('0x'+buf_ptr);

        var buf_ptr = ptr(ptr(lpBuffers.add(4)).readUInt());
        // console.log(buf_ptr,buf_ptr2);

        var data = Memory.readByteArray(buf_ptr, len);
        // console.log("data:",buf2hex(data));
        // send("wsa_send",data=data);
        send({
            fd:args[0].toString(),
            type:"send",
            func:"wsa_send",
            data:buf2hex(data)
        });
    }
});