import { pool } from "../db.js"

export const createTest = async (req, res) => {
    try {
        const {
            id_user,
            id_room,
            reaction_time_avg,
            error_count,
            correct_decisions,
            distracted_events,
            total_time,
            final_score,
            test_version
        } = req.body;

        // 1. Calcular el nivel de riesgo
        let id_risk_level;

        if (error_count > 7 || total_time > 300 || distracted_events > 5) {
            id_risk_level = process.env.RISK_LEVEL_VERY_HIGHT;
        } else if (error_count >= 4 || total_time > 180 || distracted_events >= 3) {
            id_risk_level = process.env.RISK_LEVEL_HIGHT;
        } else if (error_count >= 1 || total_time > 90) {
            id_risk_level = process.env.RISK_LEVEL_LOW;
        } else {
            id_risk_level = process.env.RISK_LEVEL_NORMAL;
        }

        // 2. Crear el test
        const id_test = uuidv4();
        await pool.query(
            `INSERT INTO tests (id_test, id_user, id_room, id_risk_level, final_score, test_version)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [id_test, id_user, id_room, id_risk_level, final_score, test_version]
        );

        // 3. Crear las métricas del test
        const id_test_metric = uuidv4();
        await pool.query(
            `INSERT INTO test_metrics (id_test_metric, id_test, reaction_time_avg, error_count, correct_decisions, distracted_events, total_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                id_test_metric,
                id_test,
                reaction_time_avg,
                error_count,
                correct_decisions,
                distracted_events,
                total_time
            ]
        );

        res.status(201).json({ message: 'Test creado exitosamente', id_test });
    } catch (error) {
        console.error('Error creando el test:', error);
        res.status(500).json({ error: 'Error al crear el test' });
    }
}

export const getTestsByRoom = async (req, res) => {
    try {
        const { id_room } = req.params;

        const query = `
        SELECT 
          t.id_test,
          u.name AS student_name,
          rl.risk_name,
          t.final_score,
          t.test_date
        FROM tests t
        INNER JOIN users u ON t.id_user = u.id_user
        INNER JOIN risk_levels rl ON t.id_risk_level = rl.id_risk_level
        WHERE t.id_room = $1
        ORDER BY t.test_date DESC
      `;

        const { rows } = await pool.query(query, [id_room]);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los tests de la sala:', error);
        res.status(500).json({ error: 'Error al obtener los tests' });
    }
};