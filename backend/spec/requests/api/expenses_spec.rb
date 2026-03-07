require 'rails_helper'

RSpec.describe "Api::Expenses", type: :request do
  let!(:food_category) { Category.create!(name: "Food", icon: "🍔") }
  let!(:transport_category) { Category.create!(name: "Transport", icon: "🚗") }

  describe "GET /api/expenses" do
  let!(:expense1) { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.today) }
  let!(:expense2) { Expense.create!(description: "Taxi", amount: 50.00, category: transport_category, date: Date.today) }

  before { expense1.update!(created_at: 1.day.ago) }

    it "returns all expenses with category information" do
      get "/api/expenses"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "returns expenses in descending order by created_at" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json.first["id"]).to eq(expense2.id)
      expect(json.last["id"]).to eq(expense1.id)
    end
  end

  describe "POST /api/expenses" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          expense: {
            description: "Team Lunch",
            amount: 150.50,
            category_id: food_category.id,
            date: Date.today
          }
        }
      end

      it "creates a new expense" do
        expect {
          post "/api/expenses", params: valid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["description"]).to eq("Team Lunch")
        expect(json["amount"]).to eq(150.5)
      end
    end

    context "with invalid parameters" do
      it "with negative amounts" do
        invalid_params = {
          expense: {
            description: "Invalid expense",
            amount: -100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(0)

        expect(response).to have_http_status(:unprocessable_content)
      end

      it "with empty descriptions" do
        invalid_params = {
          expense: {
            description: "",
            amount: 100.00,
            category_id: food_category.id,
            date: Date.today
          }
        }

        expect {
          post "/api/expenses", params: invalid_params, as: :json
        }.to change(Expense, :count).by(0)

        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "PUT /api/expenses/:id" do
    let!(:expense)    { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.today) }
    context "with valid parameter"  do
      let(:valid_params) do
        {
          expense: {
            description: "Updated Lunch",
            amount: 120.00,
            category_id: transport_category.id,
            date: Date.today
          }
        }
      end

      it "update an existing expense" do
        put "/api/expenses/#{expense.id}", params: valid_params, as: :json
        puts response.status
        puts response.body
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["description"]).to eq("Updated Lunch")
        expect(json["amount"]).to eq(120.00)
        expect(json["category"]).to eq(transport_category.name)
        expect(json["date"]).to eq(Date.today.to_s)
      end
    end

    context "with invalid parameters" do
      it "does not update with empty fields" do
        put "/api/expenses/#{expense.id}", params: { expense: { description: "" } }, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end

      it "does not update with negative amount" do
        put "/api/expenses/#{expense.id}", params: { expense: { amount: -12.00 } }, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /api/expenses/:id" do
    let!(:expense) { Expense.create!(description: "Lunch", amount: 100.00, category: food_category, date: Date.today) }

    it "deletes an expense" do
      expect {
        delete "/api/expenses/#{expense.id}"
      }.to change(Expense, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
