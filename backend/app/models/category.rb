class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  validates :name, presence: true
  validates :icon, presence: true
end
