import yaml 
import psycopg2

CELLS_FILE = "./cells.yml"

PG_USER = 'docker'
PG_PASSWORD = 'docker'
PG_HOST = '127.0.0.1'
PG_PORT = '5432'
PG_DATABASE = 'dauntcell'

SQL_DROP_CELL_TABLE = """
DROP TABLE IF EXISTS cells;
"""

SQL_CREATE_CELL_TABLE = """
CREATE TABLE cells(
	name VARCHAR (255) UNIQUE PRIMARY KEY NOT NULL,
	description TEXT NOT NULL,
	type VARCHAR (255) NOT NULL,
	levels text []
);
"""

SQL_CELL_TABLE_ROW_COUNT = """
SELECT COUNT(*) FROM cells;
"""

def load_cells():
    with open(CELLS_FILE, 'r') as file:
        data = file.read()
        return yaml.load(data, Loader=yaml.BaseLoader)

def connect_pg():
    try:
        connection = psycopg2.connect(
            user=PG_USER,
            password=PG_PASSWORD,
            host=PG_HOST,
            port=PG_PORT,
            database=PG_DATABASE
        )
        cursor = connection.cursor()
        cursor.execute("SELECT version();")
        record = cursor.fetchone()
        print("You are connected to - ", record,"\n")
        cursor.close()
        return connection
    except (Exception, psycopg2.Error) as error :
        print(f'Error connecting to {PG_HOST}:{PG_PORT} as {PG_USER}', error)

def init_table(connection):
    try:
        cursor = connection.cursor()
        cursor.execute(SQL_DROP_CELL_TABLE)
        cursor.execute(SQL_CREATE_CELL_TABLE)
        connection.commit()
    except (Exception, psycopg2.Error) as error:
        print('Error initializing table', error)
    finally:
        cursor.close()

def fill_table(connection, cells):
    try:
        for cell in cells:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO cells (name, description, type, levels) VALUES (%s, %s, %s, %s)",
                (cell['name'], cell['description'], cell['type'], cell['levels'])
            )
        connection.commit()
    except (Exception, psycopg2.Error) as error:
        print(error)
    finally:
        cursor.close()

def count_rows(connection):
    try:
        cursor = connection.cursor()
        cursor.execute(SQL_CELL_TABLE_ROW_COUNT)
        print(cursor.fetchone())
        connection.commit()
    except (Exception, psycopg2.Error) as error:
        print('Error counting rows', error)
    finally:
        cursor.close()

def main():
    cells = load_cells()
    connection = connect_pg()
    init_table(connection)
    fill_table(connection, cells)
    count_rows(connection)

    connection.close() 

if __name__ == "__main__":
    main()