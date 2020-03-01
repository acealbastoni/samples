///var REGION = 'us-east-1';
//var EXPIRES = 3600 * 24 * 7; // = 24h expressed in seconds

//--------------------------------------------------------

var S3 = function (AWS_KEY, AWS_SECRET) {
    if (typeof AWS_KEY !== 'string')
        throw "Must pass accessKeyId to S3 constructor";
    if (typeof AWS_SECRET !== 'string')
        throw "Must pass secretAcessKey to S3 constructor";
    this.AWS_KEY = AWS_KEY;
    this.AWS_SECRET = AWS_SECRET;
};

function getInstance(AWS_KEY, AWS_SECRET) {
    this.AWS_KEY = AWS_KEY;
    this.AWS_SECRET = AWS_SECRET;
    return new S3(AWS_KEY, AWS_SECRET);
}

function _buildHost(bucket, region) {
    var host = bucket + '.s3.' + region + '.amazonaws.com';
    return host;
}
function _getAmzCredential(aws_key, datetime, region) {
    var date = Utilities.formatDate(datetime, 'GMT', 'yyyyMMdd');
    var format = '%s/%s/%s/s3/aws4_request';
    var raw = Utilities.formatString(format, aws_key, date, region);
    var uri_encoded = encodeURIComponent(raw);
    return uri_encoded;
}
function _intoHex(value) {

    //inspired by https://stackoverflow.com/a/41232906
    return value.reduce(function (str, chr) {
        chr = (chr < 0 ? chr + 256 : chr).toString(16);
        return str + (chr.length == 1 ? '0' : '') + chr;
    }, '');
}
function _getHmacSha256(key, value) {

    //this is how Google Apps Script needs to have it
    //https://developers.google.com/apps-script/reference/utilities/utilities#computehmacsha256signaturevalue-key
    var value_prepared = Utilities.base64Decode(Utilities.base64Encode(value));
    var key_prepared = Utilities.base64Decode(Utilities.base64Encode(key));

    var hmac = Utilities.computeHmacSha256Signature(
        value_prepared,
        key_prepared
    );
    return hmac;
}
function _computeSignature(key, string) {
    var hmac = _getHmacSha256(key, string);
    var hex = _intoHex(hmac);
    return hex;
}

function _dateInto8601(datetime) {
    var amzDate = Utilities.formatDate(datetime, 'GMT', 'yyyyMMdd\'T\'HHmmss\'Z\'');
    return amzDate;
}

function _buildCanonicalRequest(aws_key, bucket, path, timestamp, region, expires) {

    var datetime = new Date(timestamp);

    var amzCredential = _getAmzCredential(aws_key, datetime, region);
    var amzDate = _dateInto8601(datetime);
    var host = _buildHost(bucket, region);

    var requestFormat = 'GET\n' +
        '/%s\n' +
        'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
        'X-Amz-Credential=%s&' +
        'X-Amz-Date=%s&' +
        'X-Amz-Expires=%s&' +
        'X-Amz-SignedHeaders=host\n' +
        'host:%s\n\n' +
        'host\n' +
        'UNSIGNED-PAYLOAD';

    var request = Utilities.formatString(
        requestFormat,
        path,
        amzCredential,
        amzDate,
        expires,
        host
    );

    return request;
}
function _getSha256Hash(value) {

    var hash = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        value,
        Utilities.Charset.UTF_8
    );

    return hash;
}

function _buildStringToSign(canonicalRequest, region, datetime) {
    var date = Utilities.formatDate(datetime, 'GMT', 'yyyyMMdd');
    var scope = Utilities.formatString('%s/%s/s3/aws4_request', date, region);

    var timestamp = _dateInto8601(datetime);
    var hash = _getSha256Hash(canonicalRequest);
    var hexHash = _intoHex(hash);

    var stringFormat = 'AWS4-HMAC-SHA256\n%s\n%s\n%s';
    var stringToSign = Utilities.formatString(stringFormat, timestamp, scope, hexHash);
    return stringToSign;
}
function _computeSigningKey(aws_secret, datetime, region) {

    var date = Utilities.formatDate(datetime, 'GMT', 'yyyyMMdd');
    var dateKey = _getHmacSha256('AWS4' + aws_secret, date);
    var dateRegionKey = _getHmacSha256(dateKey, region);
    var dateRegionServiceKey = _getHmacSha256(dateRegionKey, "s3");
    var signingKey = _getHmacSha256(dateRegionServiceKey, "aws4_request");
    return signingKey;
}
function _internalGenerateS3GetUrlGivenAllParams(
    aws_key,
    aws_secret,
    region,
    bucket,
    path,
    timestamp,
    expires
) {

    var datetime = new Date(timestamp);

    var canonicalRequest = _buildCanonicalRequest(aws_key, bucket, path, timestamp, region, expires);
    var stringToSign = _buildStringToSign(canonicalRequest, region, datetime);
    var signingKey = _computeSigningKey(aws_secret, datetime, region);
    var signature = _computeSignature(signingKey, stringToSign);
    var amzDate = _dateInto8601(datetime);
    var amzCredential = _getAmzCredential(aws_key, datetime, region);

    var host = _buildHost(bucket, region);
    var presignedURL = 'https://' + host + '/' + encodeURIComponent(path) +
        '?X-Amz-Algorithm=AWS4-HMAC-SHA256' +
        '&X-Amz-Credential=' + amzCredential +
        '&X-Amz-Date=' + amzDate +
        '&X-Amz-Expires=' + expires +
        '&X-Amz-SignedHeaders=host' +
        '&X-Amz-Signature=' + signature;

    return presignedURL;
}



//------------------------------------------------- 1 
S3.prototype.readEventsFromS3 = function (key) {

    var path = key//"Event/" + subscriberId + "/" + dateToken + "/EventData.json";
    var timestamp = Date.now();
    var url = _internalGenerateS3GetUrlGivenAllParams(
        AWS_KEY,
        AWS_SECRET,
        QMedicConstants.REGION,
        QMedicConstants.BUCKET,
        path,
        timestamp,
        QMedicConstants.EXPIRES
    );
    var jsonEvents = UrlFetchApp.fetch(url);
    return jsonEvents;
};
