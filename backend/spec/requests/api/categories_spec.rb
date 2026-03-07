require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food", icon: "🍔") }
    let!(:transport) { Category.create!(name: "Transport", icon: "🚗") }
    let!(:supplies) { Category.create!(name: "Supplies", icon: "📦") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end

    it "returns the correct fields" do
      get "/api/categories"
      json = JSON.parse(response.body)
      expect(json.first.keys).to include("id", "name", "icon")
    end
  end

  describe "POST /api/categories" do
    context "with valid parameters" do
      let(:valid_params) do
        { category: { name: "Computer", icon: "💻" } }
      end

      it "creates a new category" do
        expect {
          post "/api/categories", params: valid_params, as: :json
        }.to change(Category, :count).by(1)
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Computer")
        expect(json["icon"]).to eq("💻")
      end
    end

    context "with invalid parameters" do
      it "does not create with empty name" do
        expect {
          post "/api/categories", params: { category: { name: "", icon: "💻" } }, as: :json
        }.to change(Category, :count).by(0)
        expect(response).to have_http_status(:unprocessable_content)
      end

      it "does not create with empty icon" do
        expect {
          post "/api/categories", params: { category: { name: "Computer", icon: "" } }, as: :json
        }.to change(Category, :count).by(0)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "PUT /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food", icon: "🍔") }

    context "with valid parameters" do
      it "updates a category" do
        put "/api/categories/#{category.id}", params: { category: { name: "Groceries", icon: "🛒" } }, as: :json
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Groceries")
        expect(json["icon"]).to eq("🛒")
      end
    end

    context "with invalid parameters" do
      it "does not update with empty name" do
        put "/api/categories/#{category.id}", params: { category: { name: "" } }, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end

      it "does not update with empty icon" do
        put "/api/categories/#{category.id}", params: { category: { icon: "" } }, as: :json
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /api/categories/:id" do
    let!(:category) { Category.create!(name: "Food", icon: "🍔") }

    it "deletes a category" do
      expect {
        delete "/api/categories/#{category.id}"
      }.to change(Category, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "does not delete a category that is in use" do
      Expense.create!(description: "Lunch", amount: 100.00, category: category, date: Date.today)
      expect {
        delete "/api/categories/#{category.id}"
      }.to change(Category, :count).by(0)
      expect(response).to have_http_status(:unprocessable_content)
    end
  end
end
