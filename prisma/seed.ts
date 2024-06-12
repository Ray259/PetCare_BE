import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      password: '123123',
      phone: '1234567890',
      role: 'user',
      gender: 'female',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'bob',
      password: '123123',
      phone: '0987654321',
      role: 'admin',
      gender: 'male',
    },
  });

  // Seed Pets
  const pet1 = await prisma.pet.create({
    data: {
      name: 'Buddy',
      age: 3,
      weight: 15.0,
      color: 'Brown',
      gender: 'male',
      breed: 'Beagle',
      avatar:
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ6hDDV0agDjhC-pxESSvOSbtsd59FDDFgBxfRCYVN1Z_vpmlPa',
      ownerId: user1.id,
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: 'Mittens',
      age: 2,
      weight: 10.0,
      color: 'Black',
      gender: 'female',
      breed: 'Siamese',
      avatar:
        'https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-06/Siamese-Cat_0.jpg?itok=Qy1J6ZDS',
      ownerId: user2.id,
    },
  });

  // Seed Service Details
  await prisma.serviceDetails.createMany({
    data: [
      {
        serviceName: 'Healthcare Service',
        description: 'Annual healthcare checkup and vaccination for pets.',
        price: 50.0,
      },
      {
        serviceName: 'Grooming Service',
        description: 'Complete grooming service for pets.',
        price: 30.0,
      },
      {
        serviceName: 'Appointment Service',
        description: 'Schedule appointments for pet consultations.',
        price: 20.0,
      },
      {
        serviceName: 'Boarding Service',
        description: 'Safe and comfortable boarding for pets.',
        price: 40.0,
      },
    ],
  });

  // Seed Healthcare Services
  await prisma.healthcareService.create({
    data: {
      petId: pet1.id,
      description: 'Routine check-up',
      temperature: 38.5,
      heartRate: 80,
      respiratoryRate: 20,
      weight: 15.0,
      bodyCondition: 'Good',
      symptoms: 'None',
      bloodTest: 'Normal',
      urineTest: 'Normal',
      xRay: 'Clear',
      diagnosis: 'Healthy',
      diet: 'Standard',
      date: new Date(),
      medicine: ['Vitamins'],
      status: 'approved',
    },
  });

  // Seed Grooming Services
  await prisma.groomingService.create({
    data: {
      petId: pet2.id,
      date: new Date(),
      additionalInfo: { notes: 'Regular grooming session' },
      status: 'approved',
    },
  });

  // Seed Boarding Services
  await prisma.boardingService.create({
    data: {
      petId: pet1.id,
      cage: 12,
      address: '123 Pet Boarding Street',
      date: new Date(),
      additionalInfo: { notes: 'Boarding for 3 days' },
      status: 'approved',
    },
  });

  // Seed Appointments
  await prisma.appointments.create({
    data: {
      petId: pet2.id,
      doctor: 'Dr. Smith',
      description: 'Annual check-up',
      followUp: true,
      date: new Date(),
      additionalInfo: { notes: 'Follow-up needed in 6 months' },
      status: 'approved',
    },
  });

  // Seed Notifications
  await prisma.notification.create({
    data: {
      userId: user1.id,
      title: 'Appointment Reminder',
      description: 'Your appointment with Dr. Smith is scheduled for tomorrow.',
      date: new Date(),
      additionalInfo: { type: 'reminder' },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
