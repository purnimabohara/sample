//extension for test file--test.js
// describe -- collection of test cases
//(it) function for testing

  const request = require("supertest");
      const app = require("../index");
       
      describe("API Endpoints Test", () => {
          let token;
        it("GET /test | Response should be text", async () => {
          const response = await request(app).get("/test");
          expect(response.statusCode).toBe(200);
          expect(response.text).toBe("Hello");
        });

        //test for login
        it("Login", async () => {
            const response = await request(app).post("/api/user/login").send({
              email: "jabemi1176@hidelux.com",
              password: "12345",
            });
            if (!response.body.success) {
              expect(response.body.message).toEqual("User doesn't exists");
            } else {
              expect(response.statusCode).toBe(200);
              expect(response.body.message).toEqual("User logged in successfully.");
              expect(response.body).toHaveProperty("token");
              token = response.body.token;
            }
          }, 20000); 

    //testing get all restaurants routes  '/api/product/get_products'
    it('GET /api/user/get_restaurants | Response with valid json' ,async()=>{
        const response= await request(app).get('/api/user/get_restaurants')
        if(response.body.success){
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Restaurant fetched sucessfully")
        }else{
            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe("Server Error")
           }



        
        

    })

    //testing user registration route 'api/user/create'
    it('POST /api/user/create | Response with valid json', async ()=>{
        const response= await request(app).post('/api/user/create').send({
            firstName :'purnima',
            lastName: 'test',
            email:'pur123@gmail.com',
            password : 'pur123'
        }) 
           

        
        
        console.log(response.body);
       if(response.body.success){
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("User created successfully.")
    
       }else{
        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("User already exists.")
       }
            
    })

   
// testing fetching of item routes
    it('GET Item | Fetch single item',async()=>{
        const response =await request(app).get('/api/user/get_item/65d37cdf900b68d3390d6bde')
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('item');

    })

    
     // testing for single request
    it("GET Request | Fetch single request", async () => {
        const response = await request(app).get("/api/admin/get_requests");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("message", "Authorization header not found!");
      });
     
    
      it("GET Request | Fetch single request", async () => {
        const response = await request(app).get("/api/admin/get_bookings");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("success", false);
        expect(response.body).toHaveProperty("message", "Authorization header not found!");
      });
     
      it("DELETE Request | Delete single request", async () => {
        const response = await request(app).delete("/api/requests/65de02011c7bb87e53586e00");
        if (response.body) {
          if (response.body.success) {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("Request deleted successfully");
          } else {
            expect(response.statusCode).toBe(400); // Expecting 404 for request not found
            if (response.body.message) {
              expect(response.body.message).toEqual("Request not found");
            } 
          }
        } else {
          // Handle unexpected error
          throw new Error("Response body does not contain 'message'");
        }
      });
      
      it("DELETE Restaurant | Delete single restaurant", async () => {
        const response = await request(app).delete("/api/get_restaurant/65d0ca53ed673d3d1affbe90");
        if (response.body) {
          if (response.body.success) {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual("Restaurant deleted successfully");
          } else {
            expect(response.statusCode).toBe(404); // Expecting 404 for request not found
            if (response.body.message) {
              expect(response.body.message).toEqual("Restaurant not found");
            } 
          }
        } else {
          // Handle unexpected response body
          throw new Error("Response body does not contain 'message'");
        }
      });
      it("DELETE Menus | Delete single menust", async () => {
        const response = await request(app).delete("/api/admin/delete_menu/65d3792b3cd119615f07f6e9");
        if (response.body) {
          if (response.body.success) {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual('Menu deleted successfully');
          } else {
            expect(response.statusCode).toBe(404); // Expecting 404 for request not found
            if (response.body.message) {
              expect(response.body.message).toEqual('Menu not found');
            } 
          }
        } else {
          // Handle unexpected response body
          throw new Error("Response body does not contain 'message'");
        }
      });
     
    
      
      });
    

   