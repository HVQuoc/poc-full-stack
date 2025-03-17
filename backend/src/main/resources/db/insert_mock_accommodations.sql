INSERT INTO accommodations (
    title, short_description, description, address, cover_img_src, price, num_of_bedroom, num_of_bed, max_guests, location
) VALUES
      ('Cozy Apartment in City Center', 'A comfortable apartment in the heart of the city.', 'Spacious and modern accommodation with excellent facilities.', '123 Main Street, New York, USA', 'https://picsum.photos/600/400?random=1', 120, 2, 2, 4, ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)),
      ('Seaside Villa with Ocean View', 'Enjoy stunning ocean views from this luxury villa.', 'A beautiful villa near the sea with top amenities.', '456 Ocean Drive, Miami, USA', 'https://picsum.photos/600/400?random=2', 250, 3, 4, 6, ST_SetSRID(ST_MakePoint(-80.1918, 25.7617), 4326)),
      ('Rustic Cabin in the Mountains', 'A peaceful retreat in the mountains.', 'Perfect for nature lovers, this cabin offers a cozy escape.', '789 Pine Road, Denver, USA', 'https://picsum.photos/600/400?random=3', 90, 2, 3, 5, ST_SetSRID(ST_MakePoint(-104.9903, 39.7392), 4326)),
      ('Modern Studio in Downtown', 'A stylish studio in the city.', 'Close to everything, perfect for business travelers.', '321 Market Street, San Francisco, USA', 'https://picsum.photos/600/400?random=4', 180, 1, 1, 2, ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)),
      ('Luxury Penthouse with Skyline View', 'Top-floor penthouse with breathtaking city views.', 'Exclusive penthouse with premium facilities.', '555 Skyline Avenue, Los Angeles, USA', 'https://picsum.photos/600/400?random=5', 400, 4, 5, 8, ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326)),
      ('Charming Cottage in the Countryside', 'A quiet countryside retreat.', 'Relax in this beautiful cottage surrounded by nature.', '789 Greenway Road, Texas, USA', 'https://picsum.photos/600/400?random=6', 130, 2, 2, 4, ST_SetSRID(ST_MakePoint(-99.1332, 31.9686), 4326)),
      ('Beachfront Bungalow', 'Step onto the sand from your door.', 'Enjoy direct beach access and stunning views.', '22 Palm Beach Road, Bali, Indonesia', 'https://picsum.photos/600/400?random=7', 210, 3, 4, 6, ST_SetSRID(ST_MakePoint(115.1889, -8.4095), 4326)),
      ('Ski Chalet with Fireplace', 'A cozy winter retreat in the Alps.', 'Perfect for ski enthusiasts and winter lovers.', '88 Snowy Peak Lane, Zurich, Switzerland', 'https://picsum.photos/600/400?random=8', 300, 3, 5, 7, ST_SetSRID(ST_MakePoint(8.5417, 47.3769), 4326)),
      ('Private Island Resort', 'Exclusive stay on your own private island.', 'Luxury resort experience in total privacy.', '1 Paradise Island, Maldives', 'https://picsum.photos/600/400?random=9', 1200, 5, 7, 10, ST_SetSRID(ST_MakePoint(73.2207, 3.2028), 4326)),
      ('Treehouse Adventure Stay', 'Stay in a treehouse high above the forest.', 'Unique experience for adventure seekers.', '99 Forest Lane, Costa Rica', 'https://picsum.photos/600/400?random=10', 160, 2, 2, 4, ST_SetSRID(ST_MakePoint(-84.0739, 9.7489), 4326));

-- Generate 90 more random accommodations dynamically
DO $$
DECLARE
i INT := 11;
BEGIN
    WHILE i <= 10000 LOOP
        INSERT INTO accommodations (
            title, short_description, description, address, cover_img_src, price, num_of_bedroom, num_of_bed, max_guests, location
        ) VALUES (
            'Accommodation ' || i,
            'A beautiful place to stay.',
            'Spacious and comfortable for travelers.',
            'Random Address ' || i || ', City, Country',
            'https://picsum.photos/600/400?random=' || i,
            50 + (random() * 250)::INT,
            1 + (random() * 4)::INT,
            1 + (random() * 4)::INT,
            2 + (random() * 6)::INT,
            ST_SetSRID(ST_MakePoint(-180 + random() * 360, -90 + random() * 180), 4326)
        );
        i := i + 1;
END LOOP;
END $$;
