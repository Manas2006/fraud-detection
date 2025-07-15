CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    channel VARCHAR(10) NOT NULL CHECK (channel IN ('EMAIL', 'SMS', 'CALL')),
    text TEXT NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    label VARCHAR(10) NOT NULL CHECK (label IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient querying by user and risk priority
CREATE INDEX idx_messages_user_risk_created ON messages (user_id, label, created_at DESC);

-- Index for finding high-risk messages quickly
CREATE INDEX idx_messages_high_risk ON messages (label, created_at DESC) WHERE label = 'HIGH';

-- Index for time-based queries
CREATE INDEX idx_messages_created_at ON messages (created_at DESC); 