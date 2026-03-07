class Expense < ApplicationRecord
  belongs_to :category

  validates :description, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :date, comparison: { less_than_or_equal_to: Date.today }
  validates :category, presence: true
end
