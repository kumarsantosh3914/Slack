export default function crudRepository(model) {
    return {
        create: async function create(data) {
            const createdDocument = await model.create(data);
            return createdDocument;
        },

        getAll: async function getAll(filter = {}, options = {}) {
            const { projection = null, sort = { createdAt: -1 }, limit = 50, skip = 0, lean = true } = options;
            const query = model.find(filter, projection).sort(sort).limit(limit).skip(skip);
            return lean ? query.lean().exec() : query.exec();
        },

        getById: async function getById(id, options = {}) {
            const { projection = null, lean = true } = options;
            const query = model.findById(id, projection);
            return lean ? query.lean().exec() : query.exec();
        },

        delete: async function deleteById(id) {
            const deleted = await model.findByIdAndDelete(id).lean();
            return deleted;
        },

        update: async function updateById(id, data, options = {}) {
            const { runValidators = true, newDocument = true, lean = false } = options;
            const query = model.findByIdAndUpdate(id, data, {
                new: newDocument,
                runValidators,
            });
            return lean ? query.lean().exec() : query.exec();
        },

        deleteMany: async function deleteMany(modelIds) {
            const result = await model.deleteMany({ _id: { $in: modelIds } });
            return result;
        }
    };
}