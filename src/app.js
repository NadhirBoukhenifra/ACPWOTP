var encrypt_text_text_normal = document.getElementById("encrypt_text_text_normal");
var encrypt_text_text_binary = document.getElementById("encrypt_text_text_binary");
var encrypt_text_key_binary = document.getElementById("encrypt_text_key_binary");
var encrypt_text_key_text = document.getElementById("encrypt_text_key_text");
var encrypt_text_encrypted_text_binary = document.getElementById("encrypt_text_encrypted_text_binary");
var encrypt_text_encrypted_text_text = document.getElementById("encrypt_text_encrypted_text_text");
var encrypt_text_decrypted_text = document.getElementById("encrypt_text_decrypted_text");

var decrypt_text_key_text = document.getElementById("decrypt_text_key_text");
var decrypt_text_encrypted_text_text = document.getElementById("decrypt_text_encrypted_text_text");
var decrypt_text_decrypted_text = document.getElementById("decrypt_text_decrypted_text");

var encrypt_image_upload_image = document.getElementById("encrypt_image_upload_image");
var encrypt_image_upload_button = document.getElementById("encrypt_image_upload_button");

var encrypt_image_normal_colored_image_canvas = document.getElementById("encrypt_image_normal_colored_image_canvas");
var encrypt_image_normal_grayscale_image_canvas = document.getElementById("encrypt_image_normal_grayscale_image_canvas");
var encrypt_image_normal_black_and_white_image_canvas = document.getElementById("encrypt_image_normal_black_and_white_image_canvas");
var encrypt_image_encrypted_image_canvas = document.getElementById("encrypt_image_encrypted_image_canvas");
var encrypt_image_binary_key = document.getElementById("encrypt_image_binary_key");

var decrypt_image_upload_image = document.getElementById("decrypt_image_upload_image");
var decrypt_image_upload_button = document.getElementById("decrypt_image_upload_button");
var decrypt_image_binary_key = document.getElementById("decrypt_image_binary_key");
var decrypt_image_uploaded_image_canvas = document.getElementById("decrypt_image_uploaded_image_canvas");
var decrypt_image_decrypted_image_canvas = document.getElementById("decrypt_image_decrypted_image_canvas");


var encrypt_image_normal_colored_image_context = encrypt_image_normal_colored_image_canvas.getContext('2d');
var encrypt_image_normal_grayscale_image_context = encrypt_image_normal_grayscale_image_canvas.getContext('2d');
var encrypt_image_normal_black_and_white_image_context = encrypt_image_normal_black_and_white_image_canvas.getContext('2d');
var encrypt_image_encrypted_image_context = encrypt_image_encrypted_image_canvas.getContext('2d');

var decrypt_image_uploaded_image_context = decrypt_image_uploaded_image_canvas.getContext('2d');
var decrypt_image_decrypted_image_context = decrypt_image_decrypted_image_canvas.getContext('2d');


window.onload = function () {
  encrypt_text_text_normal.focus();
  encrypt_text_text_normal.onkeyup = function () {
    encryptText();
  };
}

// START unicode <2> text
var UTF_BITS = 16;

function padLeftTo(string, padChar, numChars) {
  return (new Array(numChars - string.length + 1)).join(padChar) + string;
}

function unicodeToBinary(char) {
  return char.split('').map(function (codepoint) {
    return padLeftTo(codepoint.charCodeAt(0).toString(2), 0, UTF_BITS);
  }).join('');
}

function binaryToUnicode(binaryList) {
  var codepointsAsNumbers = [];
  while (binaryList.length > 0) {
    var codepointBits = binaryList.slice(0, UTF_BITS);
    binaryList = binaryList.slice(UTF_BITS);
    codepointsAsNumbers.push(parseInt(codepointBits, 2));
  }
  return String.fromCharCode.apply(this, codepointsAsNumbers);
}
// END unicode <2> text

function generateRandomKey(length) {
  var k = "";
  for (i = 0; i < length; i++) {
    k += Math.floor(Math.random() * 2) + 0;
  }
  return k;
}


function textEncryptDecrypt(text, key) {
  var t = "";
  for (i = 0; i < key.length; i++) {
    if (text[i] ^ key[i]) {
      t += "1";
    } else {
      t += "0";
    }
  }
  return t;
}

function encryptText() {
  encrypt_text_text_binary.value = "";
  encrypt_text_key_binary.value = "";
  encrypt_text_key_text.value = "";
  encrypt_text_encrypted_text_binary.value = "";
  encrypt_text_encrypted_text_text.value = "";
  encrypt_text_decrypted_text.value = "";

  encrypt_text_text_binary.value = unicodeToBinary(encrypt_text_text_normal.value);
  encrypt_text_key_binary.value = generateRandomKey(encrypt_text_text_binary.value.length);
  encrypt_text_key_text.value = binaryToUnicode(encrypt_text_key_binary.value);
  encrypt_text_encrypted_text_binary.value = textEncryptDecrypt(encrypt_text_text_binary.value, encrypt_text_key_binary.value);
  encrypt_text_encrypted_text_text.value = binaryToUnicode(encrypt_text_encrypted_text_binary.value);
  encrypt_text_decrypted_text.value = binaryToUnicode(textEncryptDecrypt(encrypt_text_encrypted_text_binary.value, encrypt_text_key_binary.value));
}

function decryptText() {

  decrypt_text_decrypted_text.value = "";
  decrypt_text_decrypted_text.value = binaryToUnicode(textEncryptDecrypt(unicodeToBinary(decrypt_text_encrypted_text_text.value), unicodeToBinary(decrypt_text_key_text.value)));

}


// open file chooser when button clicked (UI details)
document.getElementById('encrypt_image_upload_button').addEventListener('click', openDialog);

function openDialog() {
  document.getElementById('encrypt_image_upload_image').click();
}
encrypt_image_upload_image.addEventListener('change', encryptImage, false);


function encryptImage(e) {
  var fileReader = new FileReader();

  var imageDimension = 384; //px

  encrypt_image_normal_colored_image_canvas.width = imageDimension;
  encrypt_image_normal_colored_image_canvas.height = imageDimension;

  encrypt_image_normal_grayscale_image_canvas.width = imageDimension;
  encrypt_image_normal_grayscale_image_canvas.height = imageDimension;

  encrypt_image_normal_black_and_white_image_canvas.width = imageDimension;
  encrypt_image_normal_black_and_white_image_canvas.height = imageDimension;

  encrypt_image_encrypted_image_canvas.width = imageDimension;
  encrypt_image_encrypted_image_canvas.height = imageDimension;

  fileReader.onload = function (event) {

    var normalImage = new Image();

    normalImage.onload = function () {

      encrypt_image_normal_colored_image_context.drawImage(normalImage, 0, 0, imageDimension, imageDimension, 0, 0, imageDimension, imageDimension);
      var normalImageAll = encrypt_image_normal_colored_image_context.getImageData(0, 0, imageDimension, imageDimension);
      var normalImageData = normalImageAll.data;

      for (var i = 0; i < normalImageData.length; i += 4) {
        var grayscale = normalImageData[i] * .3 + normalImageData[i + 1] * .59 + normalImageData[i + 2] * .11;
        normalImageData[i + 0] = normalImageData[i + 1] = normalImageData[i + 2] = grayscale;
      }

      encrypt_image_normal_grayscale_image_context.putImageData(normalImageAll, 0, 0);

      var grayscaleImage = new Image();

      grayscaleImage.onload = function () {

        var grayscaleImageAll = encrypt_image_normal_grayscale_image_context.getImageData(0, 0, imageDimension, imageDimension);
        var grayscaleImageData = grayscaleImageAll.data;

        for (var i = 0; i < grayscaleImageData.length; i += 1) {
          grayscaleImageData[i + 0] = grayscaleImageData[i + 0] > 128 ? 255 : 0;
        }

        encrypt_image_normal_black_and_white_image_context.putImageData(grayscaleImageAll, 0, 0);

        var blackAndWhiteImage = new Image();

        blackAndWhiteImage.onload = function () {
          var blackAndWhiteImageAll = encrypt_image_normal_black_and_white_image_context.getImageData(0, 0, imageDimension, imageDimension);
          var blackAndWhiteImageData = blackAndWhiteImageAll.data;
          var encrypt_text_auto_binary_key = "";

          for (var i = 0; i < blackAndWhiteImageData.length; i += 4) {
            var randomKey = "";

            randomKey = generateRandomKey(1);
            encrypt_text_auto_binary_key += randomKey;

            blackAndWhiteImageData[i + 0] = (((blackAndWhiteImageData[i + 0] === 255) ? 1 : 0) ^ randomKey) ? 255 : 0;
            blackAndWhiteImageData[i + 1] = (((blackAndWhiteImageData[i + 1] === 255) ? 1 : 0) ^ randomKey) ? 255 : 0;
            blackAndWhiteImageData[i + 2] = (((blackAndWhiteImageData[i + 2] === 255) ? 1 : 0) ^ randomKey) ? 255 : 0;
            blackAndWhiteImageData[i + 3] = 255;

          }

          encrypt_image_encrypted_image_context.putImageData(blackAndWhiteImageAll, 0, 0);
          encrypt_image_binary_key.value = encrypt_text_auto_binary_key;
          decrypt_image_binary_key.value = encrypt_text_auto_binary_key;

          /*
          var encryptedImage= new Image();
          encryptedImage.onload = function(){
            var encryptedImageAll = encrypt_image_encrypted_image_context.getImageData(0,0,normalImage.width,normalImage.height);
            var encryptedImageData = encryptedImageAll.data;

            console.log(encryptedImageData);
            console.log(encryptedImageData.length);
            console.log(encrypt_image_binary_key.value.length);
            
            decrypt_image_decrypted_image_canvas.width = imageDimension;
            decrypt_image_decrypted_image_canvas.height = imageDimension;

            

            var j= 0;
            for(var i = 0; i < encryptedImageData.length; i += 4) {
              encryptedImageData[i+0] = (((encryptedImageData[i+0] === 255) ? 1 : 0)  ^ encrypt_image_binary_key.value[j]) ? 255 : 0;
              encryptedImageData[i+1] = (((encryptedImageData[i+1] === 255) ? 1 : 0)  ^ encrypt_image_binary_key.value[j]) ? 255 : 0;
              encryptedImageData[i+2] = (((encryptedImageData[i+2] === 255) ? 1 : 0)  ^ encrypt_image_binary_key.value[j]) ? 255 : 0;
              encryptedImageData[i+3] = 255;
              j++;

            }
            
            decrypt_image_decrypted_image_context.putImageData(encryptedImageAll,0,0);

        }
       
        encryptedImage.src=decrypt_image_decrypted_image_canvas.toDataURL();
         */

        }
        blackAndWhiteImage.src = encrypt_image_encrypted_image_canvas.toDataURL();

      }
      grayscaleImage.src = encrypt_image_normal_colored_image_canvas.toDataURL();

    }
    normalImage.src = event.target.result;

  }
  fileReader.readAsDataURL(e.target.files[0]);
}




// open file chooser when button clicked (UI details)
document.getElementById('decrypt_image_upload_button').addEventListener('click', openDecryptDialog);

function openDecryptDialog() {
  document.getElementById('decrypt_image_upload_image').click();
}
decrypt_image_upload_image.addEventListener('change', decryptImage, false);

function decryptImage(e) {
  var decryptFileReader = new FileReader();

  var imageDimension = 384; //px

  decryptFileReader.onload = function (event) {

    var decryptedImage = new Image();

    decryptedImage.onload = function () {
      decrypt_image_uploaded_image_canvas.width = imageDimension;
      decrypt_image_uploaded_image_canvas.height = imageDimension;

      decrypt_image_decrypted_image_canvas.width = imageDimension;
      decrypt_image_decrypted_image_canvas.height = imageDimension;

      decrypt_image_uploaded_image_context.drawImage(decryptedImage, 0, 0, imageDimension, imageDimension, 0, 0, imageDimension, imageDimension);
      var decryptedImageAll = decrypt_image_uploaded_image_context.getImageData(0, 0, imageDimension, imageDimension);
      var decryptedImageData = decryptedImageAll.data;

      var j = 0;
      for (var i = 0; i < decryptedImageData.length; i += 4) {
        decryptedImageData[i + 0] = (((decryptedImageData[i + 0] === 255) ? 1 : 0) ^ decrypt_image_binary_key.value[j]) ? 255 : 0;
        decryptedImageData[i + 1] = (((decryptedImageData[i + 1] === 255) ? 1 : 0) ^ decrypt_image_binary_key.value[j]) ? 255 : 0;
        decryptedImageData[i + 2] = (((decryptedImageData[i + 2] === 255) ? 1 : 0) ^ decrypt_image_binary_key.value[j]) ? 255 : 0;
        decryptedImageData[i + 3] = 255;
        j++;

      }



      decrypt_image_decrypted_image_context.putImageData(decryptedImageAll, 0, 0);

    }
    decryptedImage.src = event.target.result;
  }
  decryptFileReader.readAsDataURL(e.target.files[0]);

}