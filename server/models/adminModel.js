import db from '../config/db.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    try {
        const result = await db.query('SELECT id, fname, lname, email, user_name ,phone_number, banned FROM users Order By Id ASC');
        return result.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const getReports = async () => {
    try {
        const query = `
            SELECT id, type, date, user_id, status, description, item_id
            FROM reports 
            ORDER BY date DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const banUserById = async (userId) => {
    try {
        await db.query('UPDATE users SET banned = true WHERE id = $1', [userId]);
    } catch (error) {
        console.error('Error banning user:', error);
        throw error;
    }
};

export const unbanUserById = async (userId) => {
    try {
        await db.query('UPDATE users SET banned = false WHERE id = $1', [userId]);
    } catch (error) {
        console.error('Error unbanning user:', error);
        throw error;
    }
};

export const saveReport = async ({ description, errorType, userId, itemId }) => {
    try {
        console.log("#_##_#");
        console.log(userId);
        console.log(errorType);
        console.log(description);




        const query = `
            INSERT INTO reports (description, type, date, status, user_id, item_id)
            VALUES ($1, $2, NOW(), 'Pending', $3, $4)
            RETURNING id;
        `;
        const values = [description, errorType, userId, itemId];
        const result = await db.query(query, values);
        return result.rows[0].id;
    } catch (error) {
        console.error('Error saving report:', error);
        throw error;
    }
};

export const updateReportStatus = async (reportId, status) => {
    try {
        const query = 'UPDATE reports SET status = $1 WHERE id = $2 RETURNING *';
        const values = [status, reportId];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
};


export const verifyAdminPassword = async (username, password) => {
    try {
        const query = 'SELECT password FROM admins WHERE username = $1';
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return false;
        }
        const hashedPassword = result.rows[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying admin password:', error);
        throw error;
    }
};