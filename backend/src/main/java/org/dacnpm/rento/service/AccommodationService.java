package org.dacnpm.rento.service;

import org.dacnpm.rento.entity.Accommodation;
import org.dacnpm.rento.repository.AccommodationRepo;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AccommodationService {
    private final AccommodationRepo repository;
    private final GeometryFactory geometryFactory;

    public AccommodationService(AccommodationRepo repository) {
        this.repository = repository;
        this.geometryFactory = new GeometryFactory();
    }

    // public List<Accommodation> getNearbyAccommodations(double latitude, double
    // longitude) {
    // return repository.findNearby(latitude, longitude);
    // }
    public Page<Accommodation> getNearbyAccommodations(double latitude, double longitude, double radius, int page,
            int size) {
        Point userLocation = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        userLocation.setSRID(4326); // Important: Set correct SRID
        PageRequest pageable = PageRequest.of(page, size);
        System.out.println("radius " + radius);
        return repository.findNearbyAccommodations(userLocation, radius, pageable);
    }
}
