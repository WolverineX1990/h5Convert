function hmac(key, string, digest, fn) {
        if (!digest)
            digest = 'binary';
        if (digest === 'buffer') {
            digest = undefined;
            // todo: 不支持 buffer 类型的 hash
            return "";
        }
        if (!fn)
            fn = 'sha256';
        if (typeof string != 'string') {
            //string = new Buffer(string);
            // todo: 目前只支持 string
            return "";
        }
        var shaObj;
        switch (fn) {
        case "md5":
            // todo: 不支持 md5
            return "";
        case "sha1":
            shaObj = new jsSHA("SHA-1","TEXT");
            break;
        case "sha256":
            shaObj = new jsSHA("SHA-256","TEXT");
            break;
        case "sha512":
            shaObj = new jsSHA("SHA-512","TEXT");
            break;
        default:
            return "";
        }
        shaObj.setHMACKey(key, "TEXT");
        shaObj.update(string);
        switch (digest) {
        case "binary":
            return shaObj.getHMAC("BYTES");
        case "hex":
            return shaObj.getHMAC("HEX");
        case "base64":
            return shaObj.getHMAC("B64");
        default:
            return "";
        }
    }