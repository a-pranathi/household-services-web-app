import csv
import requests

class SeedLoader():
    BASE_URL = "http://127.0.0.1:5000"
    basepath = "./../../instance/"
    auth_token = ""
    headers = ""

    def __init__(self, email, password):
        response = requests.post(f"{self.BASE_URL}/api/login", json={"email": email, "password": password })
        returnValue = response.json()
        print(returnValue)
        self.auth_token = returnValue['auth_token']
        self.headers = {
            'Authentication-Token': f'{self.auth_token}'
        }

    def RegisterUsers(self):
        userFile = self.basepath + 'users.csv'
        registerURL = f"{self.BASE_URL}/api/register"
        with open(userFile, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                name = row.get("name")
                email  = row.get("email")
                password = "passc"
                phone_number  = row.get("phone_number")
                area_code  = row.get("area_code")
                address  = row.get("address")
                role = row.get("role")
                servicecategory_id = -1
                experience = 0

                if (role == "professional"):
                    servicecategory_id = row.get("servicecategory_id")
                    experience = row.get("experience")        
                    password = "passp"
                print(f"Loading user ({role}): {name}, {email}, {password}, {phone_number}, {area_code}, {address}, {servicecategory_id}, {experience}...")
                response = requests.post(registerURL, json={
                    "name" : name,
                    "email" : email,
                    "password" : password,
                    "phone_number" : phone_number,
                    "area_code" : area_code,
                    "address" : address,
                    "role" : role,
                    "servicecategory_id" : servicecategory_id,
                    "experience" : experience,
                }, headers=self.headers)

    def loadServiceCategories(self):
        servicecategoryfile = self.basepath + 'service_category.csv'
        serviceCategoryURL = f"{self.BASE_URL}/api/servicecategories"

        with open(servicecategoryfile, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                print(row.get("name"))
                print(row.get("description"))
                response = requests.post(serviceCategoryURL, json={
                    "name": row.get("name"),
                    "description": row.get("description"),
                }, headers=self.headers)

    def loadServices(self):
        servicefile = self.basepath + 'service.csv'
        serviceURL = f"{self.BASE_URL}/api/services"

        with open(servicefile, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                print(row.get("name"))
                print(row.get("description"))
                response = requests.post(serviceURL, json={
                    "name": row.get("name"),
                    "description": row.get("description"),
                    "base_price" : row.get("base_price"),
                    "time_required" : row.get("time_required"),
                    "category_id" : row.get("category_id"),
                }, headers=self.headers)

    def testServiceCateogry(self):
        servicecategoryfile = self.basepath + 'service_category.csv'
        with open(servicecategoryfile, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                print(row.get("name"))
                print(row.get("description"))

    def seed_database(self):
        #self.testServiceCateogry()
        self.loadServiceCategories()
        self.loadServices()
        self.RegisterUsers()        

if __name__ == "__main__":
    email = "admin@hxpert.co"
    password = "passa"
    seedLoader = SeedLoader(email, password)    
    seedLoader.seed_database()