import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;

}

export default async function getReservations(
    params: IParams
) {
    try {
        const { listingId, userId, authorId } = params;
        const query: any ={};

        if (listingId) {
            query.listingId = listingId;
        }  // If we query by listingId, we will get all the 
        // reservations on that particular property.

        if (userId) {
            query.userId = userId;
        }  // If searched by userId, all the trips that the specific
        // user had will be searched.

        if (authorId) {
            query.listing = {userId: authorId};
        } // This will be used to search for all the other users
        // that have reserved your listed property.

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString()
                }
            })
        );

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}