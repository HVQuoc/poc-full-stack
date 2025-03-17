package org.dacnpm.rento.repository;

import org.dacnpm.rento.entity.Accommodation;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationRepo extends JpaRepository<Accommodation, Long> {
//    @Query("SELECT a FROM Accommodation a " +
//            "WHERE ST_DistanceSphere(a.location, :point) <= :radius")
        @Query(value = """
            SELECT a.*,
                   ST_DistanceSphere(a.location, :point) as distance
            FROM accommodations a
            WHERE ST_DWithin(a.location, :point, :radius)
            ORDER BY distance ASC
            """, nativeQuery = true)
        Page<Accommodation> findNearbyAccommodations(@Param("point") Point point, @Param("radius") double radius, Pageable pageable);
        }

