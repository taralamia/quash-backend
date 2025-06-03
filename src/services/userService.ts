/*const userRepository = require('../repositories/userRepository');

exports.getUserById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.updateUser = async (id, updateData) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    user.name = updateData.name;
    user.email = updateData.email;
    return await userRepository.save(user);
};*/
