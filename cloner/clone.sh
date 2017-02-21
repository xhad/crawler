# #!/bin/bash

# if [ -z $1 ]; then
#     echo "No domain name given"
#     exit 1
# fi
# DOMAIN=$1

# # if [ -z $2 ]; then
# #     echo "No base path given"
# #     exit 1
# # fi
# PBASE="./sites"



# # #trickery to remove http(s)
# SSTRHTTP=https://
# STRHTTP=http://

# RAWDOM=${DOMAIN/$SSTRHTTP/}
# RAWDOM=${RAWDOM/$STRHTTP/}

# mkdir $PBASESE/$RAWDOM

# cd $PBASE

# #exit


# wget --domains $RAWDOM --recursive --adjust-extension --span-hosts --convert-links --backup-converted --content-disposition --page-requisites $DOMAIN


# #get rid of index.html links..

# find $RAWDOM/ -type f -exec sed -i 's/index.html//g' {} \;


# # # Replace https://salonboothurenamsterdam.nl/ with our /WEBROOT/
# # find $RAWDOM/ -type f -exec sed -i "s#$PBASE/$RAWDOM#g" {} \;

# # find $RAWDOM/ -type f -name '*.html' -exec sed -i "s#$PBASE/$RAWDOMAIN/http:#https:#g" {} \;

# # find $RAWDOM/ -type f -name '*.css' -exec sed -i "s#$PBASE/$RAWDOMAIN/http:#https:#g" {} \;

# exit

#!/bin/bash

if [ -z $1 ]; then
    echo "No domain name given"
    exit 1
fi
DOMAIN=$1

if [ -z $2 ]; then
    echo "No base path given"
    exit 1
fi
PBASE=$2


# mkdir $PBASE

cd $PBASE

#trickery to remove http(s)
SSTRHTTP=https://
STRHTTP=http://

RAWDOM=${DOMAIN/$SSTRHTTP/}
RAWDOM=${RAWDOM/$STRHTTP/}

#just the domain
echo $RAWDOM

#exit


wget --domains $RAWDOM --recursive --adjust-extension --span-hosts --convert-links --backup-converted --content-disposition --page-requisites $DOMAIN


#get rid of index.html links..

find $RAWDOM/ -type f -exec sed -i 's/index.html//g' {} \;


# Replace https://salonboothurenamsterdam.nl/ with our /WEBROOT/
find $RAWDOM/ -type f -exec sed -i "/" {} \;

find $RAWDOM/ -type f -name '*.html' -exec sed -i "s#http:#https:#g" {} \;

find $RAWDOM/ -type f -name '*.css' -exec sed -i "s#http:#https:#g" {} \;

echo "https://www.webconcepts.com.au/sites/$PBASE/$RAWDOM/"