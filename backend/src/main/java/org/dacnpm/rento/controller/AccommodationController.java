package org.dacnpm.rento.controller;

import org.dacnpm.rento.entity.Accommodation;
import org.dacnpm.rento.service.AccommodationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {
    private final AccommodationService service;

    public AccommodationController(AccommodationService service) {
        this.service = service;
    }

    @GetMapping("/nearby")
    public List<Accommodation> getNearbyAccommodations(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size
    ) {
        return service.getNearbyAccommodations(lat, lng, radius, page, size);
    }

    @GetMapping
    public List<Accommodation> getAllAccommodations(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "30") int size) {
        return service.getAllAccommodationsByPage(page, size);
    }
}
