const updateProductPrices = async (req) => {
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentHour = new Date().getHours(); // 0 = Midnight, 1 = 1 AM, ..., 23 = 11 PM

    let price;

    if (currentDay >= 1 && currentDay <= 5) { // Monday to Friday
        if (currentHour >= 9 && currentHour < 13) {
            price = 28000;
        } else if (currentHour >= 13 && currentHour < 17) {
            price = 38000;
        } else if (currentHour >= 17 || currentHour < 1) {
            price = 48000;
        }
    } else { // Saturday and Sunday
        price = 48000;
    }

    const updateFields = { price };

    const result = await Product.updateMany(
        {},
        updateFields,
        { new: true, runValidators: true }
    );

    if (result.nModified === 0) throw new NotFoundError('Tidak ada produk yang diperbarui');

    return result;
};