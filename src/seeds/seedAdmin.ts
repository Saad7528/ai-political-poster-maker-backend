import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@politicalposter.bd';
    const adminPassword = 'Admin12345!';

    const existingAdmin = await User.findOne({ emailOrPhone: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'প্রধান অ্যাডমিনিস্ট্রেটর',
        emailOrPhone: adminEmail.toLowerCase(),
        passwordHash,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully: admin@politicalposter.bd');
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin role: admin@politicalposter.bd');
    }
  } catch (error) {
    console.error('⚠️ Admin seeding error:', error);
  }
};
