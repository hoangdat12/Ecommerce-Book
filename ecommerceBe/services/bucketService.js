const { _Bucket, _Comment } = require('../models/bucketsModel');

const insertBucketService = async ({
  name,
  code,
  author,
  description,
  release,
  price,
  type,
  supelier,
  translator,
  publishingCompany,
  languae,
  weight,
  pages,
  layout,
  bucketId,
  productId,
  image_url,
}) => {
  productId = productId.toString();
  try {
    const _bucketId = new RegExp(`^${bucketId}_`);
    return await _Bucket.findOneAndUpdate(
      {
        bucketId: _bucketId,
        count: { $lt: 20 }, // get data co count nho hon 20
      },
      {
        $push: {
          //
          products: {
            name,
            code,
            author,
            description,
            release,
            price,
            type,
            supelier,
            translator,
            publishingCompany,
            languae,
            weight,
            pages,
            layout,
            image_url,
          }, //
        }, //
        $inc: { count: 1 }, // automatic increate count
        $setOnInsert: {
          bucketId: `${bucketId}_${new Date().getTime()}`,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    console.log('error ------>', error);
  }
};

const insertBucketServiceFromApi = async ({
  name,
  code,
  author,
  description,
  release,
  price,
  type,
  supelier,
  translator,
  publishingCompany,
  languae,
  weight,
  pages,
  layout,
  image_url,
  productId,
}) => {
  let bucketId = 1;
  productId = productId.toString();
  try {
    const _bucketId = new RegExp(`^${bucketId}_`);
    return await _Bucket.findOneAndUpdate(
      {
        bucketId: _bucketId,
        count: { $lt: 20 }, // get data co count nho hon 20
      },
      {
        $push: {
          //
          products: {
            name,
            code,
            author,
            description,
            release,
            price,
            type,
            supelier,
            translator,
            publishingCompany,
            languae,
            weight,
            pages,
            layout,
            image_url,
          }, //
        }, //
        $inc: { count: 1 }, // automatic increate count
        $setOnInsert: {
          bucketId: `${bucketId}_${new Date().getTime()}`,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    console.log('error ------>', error);
  }
};

const listPaging = async ({ bucketId, page = 1, pageSize = 1 }) => {
  try {
    const _bucketId = new RegExp(`^${bucketId}_`);
    return await _Bucket
      .find({
        bucketId: _bucketId,
      })
      .sort({ _id: 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  } catch (error) {
    console.error('error -------->', error);
  }
};

const insertCommentService = async ({ productId, fullname, content }) => {
  try {
    const _productId = new RegExp(`^${productId}_`);
    const comment = await _Comment.findOneAndUpdate(
      {
        productId: _productId,
        count: { $lt: 10 }, // get data co count nho hon 10
      },
      {
        $push: {
          comments: {
            fullname,
            content,
          },
        },
        $inc: { count: 1 },
        $setOnInsert: {
          productId: `${productId}_${new Date().getTime()}`,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (comment) {
      return {
        code: 200,
        message: 'success',
      };
    } else {
      return {
        code: 400,
        message: 'failure',
      };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  insertBucketService,
  listPaging,
  insertCommentService,
  insertBucketServiceFromApi,
};
