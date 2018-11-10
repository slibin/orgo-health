angular.module('groceryworld.config', [])

  .constant('CANCELORDER', 'https://fmcg.ostlive.com/cancel-order?oid=')
  .constant('APIURL', 'https://fmcg.ostlive.com/restapi/oauth2/')
  .constant('PAYPAL_API', 'https://fmcg.ostlive.com/index.php?route=ost/payment/pp_standard&oid=')
  .constant('SECURE_SUBMIT_API', 'https://fmcg.ostlive.com/index.php?route=ost/payment/securesubmit&oid=')

//  .constant('CANCELORDER', 'http://starbigbazaar.com/cancel-order?oid=')
//  .constant('APIURL', 'http://starbigbazaar.com/api/oauth2/')
//  .constant('PAYPAL_API', 'http://starbigbazaar.com/index.php?route=ost/payment/pp_standard&oid=')
//  .constant('SECURE_SUBMIT_API', 'http://starbigbazaar.com/index.php?route=ost/payment/securesubmit&oid=')

 
function setAction(data,action){
	data = data+"#"+action+"|";
	var key = CryptoJS.enc.Hex.parse('313c760db2b9aecd5233a20072b6bdb97d680015b2098f72c0f4b541379e4e48');
	var iv  = CryptoJS.enc.Hex.parse('4f372fba626e6056000ba7fe14033cfd');
	var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
	var actionString = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
	return {key:actionString};
}
