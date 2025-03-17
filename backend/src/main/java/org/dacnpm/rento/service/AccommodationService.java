package org.dacnpm.rento.service;

import org.dacnpm.rento.entity.Accommodation;
import org.dacnpm.rento.repository.AccommodationRepo;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

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
    public List<Accommodation> getNearbyAccommodations(double latitude, double longitude, double radius, int page,
            int size) {
        Point userLocation = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        userLocation.setSRID(4326); // Important: Set correct SRID
        PageRequest pageable = PageRequest.of(page, size);
        return repository.findNearbyAccommodations(userLocation, radius, pageable).getContent();
    }

    // public List<Accommodation> getAllAccommodations() {
    // return repository.findAll();
    // }
    public List<Accommodation> getAllAccommodationsByPage(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        return repository.findAll(pageable).getContent();
    }
}
