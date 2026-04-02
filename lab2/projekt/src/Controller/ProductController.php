<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/products', name: 'api_product_')]
final class ProductController extends AbstractController
{
    // 1. READ ALL
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(ProductRepository $repository): JsonResponse
    {
        $products = $repository->findAll();
        return $this->json($products);
    }

    // 2. READ ONE
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Product $product): JsonResponse
    {
        return $this->json($product);
    }

    // 3. CREATE
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $product = new Product();
        $product->setName($data['name'] ?? 'Brak nazwy');
        $product->setPrice($data['price'] ?? 0);
        $product->setDescription($data['description'] ?? '');

        $em->persist($product);
        $em->flush();

        return $this->json(['message' => 'Produkt utworzony!', 'id' => $product->getId()], Response::HTTP_CREATED);
    }

    // 4. UPDATE
    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, ProductRepository $repository, EntityManagerInterface $em): JsonResponse
    {
        $product = $repository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Nie znaleziono produktu'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        
        // Aktualizujemy tylko te pola, które zostały przesłane
        if (isset($data['name'])) $product->setName($data['name']);
        if (isset($data['price'])) $product->setPrice($data['price']);
        if (isset($data['description'])) $product->setDescription($data['description']);

        $em->flush();

        return $this->json(['message' => 'Produkt zaktualizowany!']);
    }

    // 5. DELETE
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, ProductRepository $repository, EntityManagerInterface $em): JsonResponse
    {
        $product = $repository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Nie znaleziono produktu'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($product);
        $em->flush();

        return $this->json(['message' => 'Produkt usunięty!'], Response::HTTP_OK);
    }


    // DODATKOWA METODA DO GENEROWANIA TESTOWYCH DANYCH
    #[Route('/test/generate-test-data', name: 'api_generate_data', methods: ['GET'])]
    public function generate(EntityManagerInterface $em): JsonResponse
    {
        $p1 = new Product();
        $p1->setName('Laptop');
        $p1->setPrice(3500);
        $p1->setDescription('Mocny sprzęt');

        $p2 = new Product();
        $p2->setName('Myszka');
        $p2->setPrice(150);
        $p2->setDescription('Bezprzewodowa');

        $em->persist($p1);
        $em->persist($p2);
        $em->flush();

        return $this->json(['message' => 'Dodano testowe produkty!']);
    }
}