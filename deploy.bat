set profile=personal
set bucket=kidio-web
set distribution_id=E3Q9IFD725OZ4O

aws s3 sync ./build s3://%bucket% --delete --profile=%profile% --region=us-east-1

aws cloudfront create-invalidation --distribution-id=%distribution_id% --paths="/*"  --region=us-east-1 --profile=%profile%