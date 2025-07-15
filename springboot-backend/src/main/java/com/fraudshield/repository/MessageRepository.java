package com.fraudshield.repository;

import com.fraudshield.model.Message;
import com.fraudshield.model.Message.RiskLabel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE m.userId = :userId " +
           "AND (:since IS NULL OR m.createdAt >= :since) " +
           "ORDER BY " +
           "CASE WHEN m.label = 'HIGH' THEN 1 " +
           "     WHEN m.label = 'MEDIUM' THEN 2 " +
           "     ELSE 3 END, " +
           "m.createdAt DESC")
    Page<Message> findByUserIdWithRiskPriority(
            @Param("userId") String userId,
            @Param("since") LocalDateTime since,
            Pageable pageable
    );
    
    List<Message> findByLabelAndCreatedAtAfter(RiskLabel label, LocalDateTime after);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.userId = :userId AND m.createdAt >= :since")
    long countByUserIdSince(@Param("userId") String userId, @Param("since") LocalDateTime since);
} 