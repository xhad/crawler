
echo $1
echo $2

find $1 -exec sed -i 's/!$2/!$3/!g' {} \


