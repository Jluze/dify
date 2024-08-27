
MM_NOTIFY_URL=""
data=`cat trigger.txt`
if [ $MM_NOTIFY_URL ];then
  curl  -H 'Content-Type: application/json' \
    -d "{\"msgtype\": \"text\",\"text\": {\"content\":\"同步成功 $data \"}}" \
    $MM_NOTIFY_URL
else
  echo 'MM_NOTIFY_URL not set'
fi